'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { decrypt } from '@/lib/crypto';
import { getEmployeeIdentity, hashPassword, revokeCurrentSession, setSession, verifyPassword } from '@/lib/auth';

/**
 * Log in Employee (Nurse) and set secure session cookie
 * Only approved and active employees can log in
 */
export async function employeeLogin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both login email and password' };
  }

  try {
    const nurse = await prisma.nurse.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email },
        ],
      },
    });

    if (!nurse || !nurse.passwordHash) {
      return { error: 'Invalid login credentials or account not registered' };
    }

    const verification = await verifyPassword(password, nurse.passwordHash);
    if (!verification.valid) {
      return { error: 'Invalid login credentials' };
    }

    if (!nurse.isApproved) {
      return { error: 'Your account is pending administrator verification and approval.' };
    }

    if (nurse.status !== 'ACTIVE' && nurse.status !== 'ON_DUTY') {
      return { error: `Your account is currently ${nurse.status.toLowerCase()}. Please contact administration.` };
    }

    if (verification.needsRehash) {
      await prisma.nurse.update({ where: { id: nurse.id }, data: { passwordHash: await hashPassword(password) } });
    }
    await setSession('EMPLOYEE', nurse.id, 60 * 60 * 12);

    return { success: true };
  } catch (err: any) {
    console.error('Employee login error:', err);
    return { error: 'A system error occurred. Please try again.' };
  }
}

/**
 * Log out Employee
 */
export async function employeeLogout() {
  await revokeCurrentSession('EMPLOYEE');
  return { success: true };
}

/**
 * Get active Employee Session from cookies
 */
export async function getEmployeeSession() {
  const nurse = await getEmployeeIdentity();
  return nurse && nurse.isApproved && (nurse.status === 'ACTIVE' || nurse.status === 'ON_DUTY') ? nurse : null;
}

/**
 * Fetch available open jobs for the Employee Job Board
 * Open jobs are bookings in CONFIRMED status without an assigned nurse
 */
export async function getAvailableJobs() {
  const session = await getEmployeeSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const openBookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        nurseId: null,
      },
      include: {
        service: true,
        jobClaims: {
          where: { nurseId: session.id },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Strip sensitive clinical PHI and contact info for unassigned open jobs
    const jobs = openBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      serviceName: b.service.name,
      basePrice: Number(b.service.basePrice),
      totalAmount: Number(b.totalAmount),
      totalDays: b.totalDays,
      shiftType: b.shiftType,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      area: b.area || 'Hyderabad',
      patientGender: b.patientGender,
      patientAge: b.patientAge,
      myClaim: b.jobClaims[0] ? {
        id: b.jobClaims[0].id,
        proposedPrice: Number(b.jobClaims[0].proposedPrice),
        proposedArea: b.jobClaims[0].proposedArea,
        proposedTime: b.jobClaims[0].proposedTime,
        status: b.jobClaims[0].status,
      } : null,
    }));

    return { success: true, jobs };
  } catch (err: any) {
    console.error('Fetch available jobs error:', err);
    return { error: 'Failed to load jobs board' };
  }
}

/**
 * Submit price, area, and time proposal for an open job
 */
export async function submitJobClaim(data: {
  bookingId: string;
  proposedPrice: number;
  proposedArea: string;
  proposedTime: string;
  notes?: string;
}) {
  const session = await getEmployeeSession();
  if (!session) {
    return { error: 'Please log in to submit a job proposal' };
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      return { error: 'Job not found' };
    }

    if (booking.nurseId || booking.status !== 'CONFIRMED') {
      return { error: 'This job has already been assigned or is no longer available' };
    }

    // Upsert claim
    const claim = await prisma.jobClaim.upsert({
      where: {
        bookingId_nurseId: {
          bookingId: data.bookingId,
          nurseId: session.id,
        },
      },
      update: {
        proposedPrice: data.proposedPrice,
        proposedArea: data.proposedArea,
        proposedTime: data.proposedTime,
        status: 'PENDING_APPROVAL',
        notes: data.notes || null,
      },
      create: {
        bookingId: data.bookingId,
        nurseId: session.id,
        proposedPrice: data.proposedPrice,
        proposedArea: data.proposedArea,
        proposedTime: data.proposedTime,
        status: 'PENDING_APPROVAL',
        notes: data.notes || null,
      },
    });

    revalidatePath('/employee');
    revalidatePath('/admin');
    return { success: true, claimId: claim.id };
  } catch (err: any) {
    console.error('Submit job claim error:', err);
    return { error: 'Failed to submit proposal. Please try again.' };
  }
}

/**
 * Fetch My Assigned & Approved Jobs (Patient Reveal with WhatsApp Book Now)
 * Decrypts patient details only for the approved/assigned nurse
 */
export async function getMyAssignedJobs() {
  const session = await getEmployeeSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    const assignedBookings = await prisma.booking.findMany({
      where: {
        nurseId: session.id,
      },
      include: {
        customer: true,
        service: true,
        jobClaims: {
          where: { nurseId: session.id },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const jobs = assignedBookings.map((b) => {
      // Securely decrypt PHI since this nurse is authorized
      let decryptedPatientName = b.patientName;
      let decryptedMedicalConditions = b.medicalConditions;
      let decryptedSpecialInstructions = b.specialInstructions;

      try {
        decryptedPatientName = decrypt(b.patientName);
      } catch {}
      try {
        decryptedMedicalConditions = decrypt(b.medicalConditions);
      } catch {}
      if (b.specialInstructions) {
        try {
          decryptedSpecialInstructions = decrypt(b.specialInstructions);
        } catch {}
      }

      return {
        id: b.id,
        bookingNumber: b.bookingNumber,
        serviceName: b.service.name,
        totalAmount: Number(b.totalAmount),
        totalDays: b.totalDays,
        shiftType: b.shiftType,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
        area: b.area || b.customer.addressLine1,
        // Revealed Patient Details: Location and address only (Patient phone withheld for privacy)
        patientName: decryptedPatientName,
        patientAge: b.patientAge,
        patientGender: b.patientGender,
        medicalConditions: decryptedMedicalConditions,
        specialInstructions: decryptedSpecialInstructions,
        prescriptionUrl: b.prescriptionUrl,
        customerName: b.customer.name,
        customerAddress: `${b.customer.addressLine1}${b.customer.addressLine2 ? ', ' + b.customer.addressLine2 : ''}, Pincode: ${b.customer.pincode}`,
      };
    });

    return { success: true, jobs };
  } catch (err: any) {
    console.error('Fetch assigned jobs error:', err);
    return { error: 'Failed to load assigned jobs' };
  }
}
