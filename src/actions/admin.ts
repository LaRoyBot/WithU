'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendNurseAssignment, sendBookingCompleted, sendNurseJobDispatch } from '@/lib/whatsapp';
import { decrypt, encrypt } from '@/lib/crypto';
import { getAdminIdentity, hashPassword, revokeCurrentSession, setSession, verifyPassword } from '@/lib/auth';

/**
 * Log in admin and set secure session cookie
 */
export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password' };
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return { error: 'Invalid email or password' };
    }
    const verification = await verifyPassword(password, admin.passwordHash);
    if (!verification.valid) return { error: 'Invalid email or password' };
    if (verification.needsRehash) {
      await prisma.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(password) } });
    }
    await setSession('ADMIN', admin.id, 60 * 60 * 8);

    return { success: true };
  } catch (err: any) {
    console.error('Admin login error:', err);
    return { error: 'A system error occurred. Try again.' };
  }
}

/**
 * Log out admin
 */
export async function adminLogout() {
  await revokeCurrentSession('ADMIN');
  return { success: true };
}

/**
 * Get active Admin Session from cookies
 */
export async function getAdminSession() {
  const admin = await getAdminIdentity();
  return admin && (admin.role === 'ADMIN' || admin.role === 'SUPER_ADMIN') ? admin : null;
}

/**
 * Update general Booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: string,
  notes?: string
) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized. Please log in.' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) return { error: 'Booking not found' };

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: newStatus,
          notes: notes || `Status changed to ${newStatus} by admin ${session.name}`,
          changedByAdminId: session.id,
        },
      }),
    ]);

    if (newStatus === 'COMPLETED') {
      await sendBookingCompleted(
        booking.customer.phone,
        booking.customer.name,
        booking.bookingNumber,
        Number(booking.totalAmount)
      );
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('Update booking status error:', err);
    return { error: 'Failed to update booking status' };
  }
}

/**
 * Flow 4: Assign Nurse directly and notify customer + nurse via WhatsApp
 */
export async function assignNurse(bookingId: string, nurseId: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized. Please log in.' };

  try {
    const [booking, nurse] = await Promise.all([
      prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true, service: true },
      }),
      prisma.nurse.findUnique({
        where: { id: nurseId },
      }),
    ]);

    if (!booking) return { error: 'Booking not found' };
    if (!nurse) return { error: 'Selected nurse not found' };
    if (booking.nurseId || (booking.status !== 'CONFIRMED' && booking.status !== 'NURSE_ASSIGNED')) {
      return { error: 'This booking has already been assigned or is in an invalid state.' };
    }

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          nurseId: nurse.id,
          status: 'NURSE_ASSIGNED',
        },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: 'NURSE_ASSIGNED',
          notes: `Nurse ${nurse.name} (${nurse.phone}) assigned directly by admin ${session.name}`,
          changedByAdminId: session.id,
        },
      }),
    ]);

    // Dispatch WhatsApp notifications
    await sendNurseAssignment(
      booking.customer.phone,
      booking.customer.name,
      booking.bookingNumber,
      nurse.name,
      nurse.phone
    );

    let clinicalInfo = booking.area || booking.customer.addressLine1;
    let patientDisplayName = booking.customer.name;
    try {
      const decryptedName = decrypt(booking.patientName);
      if (decryptedName) patientDisplayName = decryptedName;
      const decryptedConditions = decrypt(booking.medicalConditions);
      if (decryptedConditions) {
        clinicalInfo += ` | Care Notes: ${decryptedConditions}`;
      }
    } catch {}

    // Send dispatch to nurse: location and address details only (NO patient phone number)
    await sendNurseJobDispatch(
      nurse.phone,
      nurse.name,
      booking.bookingNumber,
      booking.service.name,
      patientDisplayName,
      clinicalInfo
    );

    revalidatePath('/admin');
    revalidatePath('/employee');
    return { success: true };
  } catch (err: any) {
    console.error('Assign nurse error:', err);
    return { error: 'Failed to assign nurse to this booking' };
  }
}

/**
 * Flow 1: Approve an Employee's Job Claim / Bid
 */
export async function approveJobClaim(claimId: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const claim = await prisma.jobClaim.findUnique({
      where: { id: claimId },
      include: {
        booking: {
          include: { customer: true, service: true },
        },
        nurse: true,
      },
    });

    if (!claim) return { error: 'Claim not found' };
    if (claim.booking.nurseId || claim.booking.status !== 'CONFIRMED') {
      return { error: 'This job has already been assigned or is no longer open for assignment.' };
    }

    await prisma.$transaction([
      prisma.jobClaim.update({
        where: { id: claimId },
        data: { status: 'APPROVED' },
      }),
      prisma.jobClaim.updateMany({
        where: {
          bookingId: claim.bookingId,
          id: { not: claimId },
        },
        data: { status: 'REJECTED', notes: 'Another caregiver was selected' },
      }),
      prisma.booking.update({
        where: { id: claim.bookingId },
        data: {
          nurseId: claim.nurseId,
          totalAmount: claim.proposedPrice,
          status: 'NURSE_ASSIGNED',
        },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId: claim.bookingId,
          fromStatus: claim.booking.status,
          toStatus: 'NURSE_ASSIGNED',
          notes: `Job claim approved by admin ${session.name}. Nurse ${claim.nurse.name} assigned at Rs. ${claim.proposedPrice}.`,
          changedByAdminId: session.id,
        },
      }),
    ]);

    await sendNurseAssignment(
      claim.booking.customer.phone,
      claim.booking.customer.name,
      claim.booking.bookingNumber,
      claim.nurse.name,
      claim.nurse.phone
    );

    let patientDisplayName = claim.booking.customer.name;
    try {
      const decryptedName = decrypt(claim.booking.patientName);
      if (decryptedName) patientDisplayName = decryptedName;
    } catch {}

    // Send dispatch to nurse: location and address details only (NO patient phone number)
    await sendNurseJobDispatch(
      claim.nurse.phone,
      claim.nurse.name,
      claim.booking.bookingNumber,
      claim.booking.service.name,
      patientDisplayName,
      claim.proposedArea || claim.booking.area || claim.booking.customer.addressLine1
    );

    revalidatePath('/admin');
    revalidatePath('/employee');
    return { success: true };
  } catch (err: any) {
    console.error('Approve job claim error:', err);
    return { error: 'Failed to approve job claim' };
  }
}

/**
 * Flow 1: Reject a Job Claim
 */
export async function rejectJobClaim(claimId: string, notes?: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.jobClaim.update({
      where: { id: claimId },
      data: {
        status: 'REJECTED',
        notes: notes || 'Rejected by coordinator',
      },
    });

    revalidatePath('/admin');
    revalidatePath('/employee');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to reject claim' };
  }
}

/**
 * Flow 2: Add or Update Nurse Profile (Admin-only Registration & Credentials)
 */
export async function upsertNurseRoster(data: {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  gender: string;
  qualification: string;
  experienceYears: number;
  skills: string;
  baseLocation?: string;
  panNumber?: string;
  aadharName?: string;
  certificationDocUrl?: string;
  isApproved?: boolean;
  status: string;
}) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    let passwordHash = undefined;
    if (data.password && data.password.trim().length > 0) {
      passwordHash = await hashPassword(data.password.trim());
    }

    let encryptedPan = data.panNumber ? (data.panNumber.includes(':') ? data.panNumber : encrypt(data.panNumber.trim().toUpperCase())) : null;
    let encryptedAadhar = data.aadharName ? (data.aadharName.includes(':') ? data.aadharName : encrypt(data.aadharName.trim())) : null;

    if (data.id) {
      const updateData: any = {
        name: data.name,
        phone: data.phone,
        email: data.email?.trim().toLowerCase() || null,
        gender: data.gender,
        qualification: data.qualification,
        experienceYears: data.experienceYears,
        skills: data.skills,
        baseLocation: data.baseLocation || null,
        panNumber: encryptedPan,
        aadharName: encryptedAadhar,
        certificationDocUrl: data.certificationDocUrl || null,
        status: data.status,
      };

      if (data.isApproved !== undefined) {
        updateData.isApproved = data.isApproved;
      }
      if (passwordHash) {
        updateData.passwordHash = passwordHash;
      }

      await prisma.nurse.update({
        where: { id: data.id },
        data: updateData,
      });
    } else {
      if (!passwordHash) return { error: 'A strong initial password is required for new staff accounts.' };
      const initialHash = passwordHash;
      await prisma.nurse.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email?.trim().toLowerCase() || null,
          passwordHash: initialHash,
          gender: data.gender,
          qualification: data.qualification,
          experienceYears: data.experienceYears,
          skills: data.skills,
          baseLocation: data.baseLocation || null,
          panNumber: encryptedPan,
          aadharName: encryptedAadhar,
          certificationDocUrl: data.certificationDocUrl || null,
          isApproved: data.isApproved !== undefined ? data.isApproved : true,
          status: data.status,
        },
      });
    }
    revalidatePath('/admin/roster');
    return { success: true };
  } catch (err: any) {
    console.error('Upsert nurse error:', err);
    return { error: 'Failed to save nurse profile. Verify phone/email is unique.' };
  }
}

/**
 * Flow 2: Toggle Nurse Approval
 */
export async function toggleNurseApproval(nurseId: string, isApproved: boolean) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.nurse.update({
      where: { id: nurseId },
      data: { isApproved },
    });
    revalidatePath('/admin/roster');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update approval status' };
  }
}

/**
 * Flow 2: Delete Nurse Profile
 */
export async function deleteNurseProfile(nurseId: string) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.nurse.delete({
      where: { id: nurseId },
    });
    revalidatePath('/admin/roster');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to delete nurse profile. They may have existing bookings attached.' };
  }
}

/**
 * Flow 3: Update or Create Service
 */
export async function upsertService(data: {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  minimumDays: number;
  isActive: boolean;
}) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (data.id) {
      await prisma.service.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          basePrice: data.basePrice,
          priceUnit: data.priceUnit,
          minimumDays: data.minimumDays,
          isActive: data.isActive,
        },
      });
    } else {
      await prisma.service.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          basePrice: data.basePrice,
          priceUnit: data.priceUnit,
          minimumDays: data.minimumDays,
          isActive: data.isActive,
        },
      });
    }

    revalidatePath('/admin/services');
    revalidatePath('/booking');
    return { success: true };
  } catch (err) {
    console.error('Upsert service error:', err);
    return { error: 'Failed to save service' };
  }
}

/**
 * Flow 3: Update Service Pricing (Legacy Helper)
 */
export async function updateServicePricing(serviceId: string, basePrice: number, isActive: boolean) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        basePrice,
        isActive,
      },
    });
    revalidatePath('/admin/services');
    revalidatePath('/booking');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update pricing' };
  }
}

/**
 * Flow 3: Fetch all Patients CRM data
 */
export async function getAdminPatients() {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        service: true,
        nurse: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const patients = bookings.map((b) => {
      let patientName = b.patientName;
      let medicalConditions = b.medicalConditions;
      let specialInstructions = b.specialInstructions;

      try {
        patientName = decrypt(b.patientName);
      } catch {}
      try {
        medicalConditions = decrypt(b.medicalConditions);
      } catch {}
      if (b.specialInstructions) {
        try {
          specialInstructions = decrypt(b.specialInstructions);
        } catch {}
      }

      return {
        bookingId: b.id,
        bookingNumber: b.bookingNumber,
        customerId: b.customer.id,
        customerName: b.customer.name,
        customerPhone: b.customer.phone,
        customerAddress: b.customer.addressLine1,
        area: b.area || b.customer.addressLine1,
        pincode: b.customer.pincode,
        serviceName: b.service.name,
        serviceId: b.service.id,
        basePrice: Number(b.service.basePrice),
        totalAmount: Number(b.totalAmount),
        patientName,
        patientAge: b.patientAge,
        patientGender: b.patientGender,
        medicalConditions,
        specialInstructions,
        prescriptionUrl: b.prescriptionUrl,
        promoCode: b.promoCode,
        status: b.status,
        nurseName: b.nurse?.name || null,
        nursePhone: b.nurse?.phone || null,
        createdAt: b.createdAt.toISOString(),
      };
    });

    return { success: true, patients };
  } catch (err: any) {
    console.error('Fetch admin patients error:', err);
    return { error: 'Failed to fetch patients list' };
  }
}

/**
 * Flow 3: Update Patient Booking Record (Phone, Price, Service)
 */
export async function updatePatientBookingDetails(data: {
  bookingId: string;
  customerPhone: string;
  serviceId: string;
  totalAmount: number;
  area?: string;
}) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { customer: true },
    });

    if (!booking) return { error: 'Booking not found' };

    await prisma.$transaction([
      prisma.customer.update({
        where: { id: booking.customerId },
        data: { phone: data.customerPhone },
      }),
      prisma.booking.update({
        where: { id: data.bookingId },
        data: {
          serviceId: data.serviceId,
          totalAmount: data.totalAmount,
          area: data.area || undefined,
        },
      }),
    ]);

    revalidatePath('/admin/patients');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('Update patient booking error:', err);
    return { error: 'Failed to update patient details' };
  }
}
