'use server';

import { prisma } from '@/lib/prisma';
import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache'; // Next.js 15 cache revalidation API
import { sendNurseAssignment, sendBookingCompleted } from '@/lib/whatsapp';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

/**
 * Log in admin and set secure session cookie
 */
export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password' };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return { error: 'Invalid email or password' };
    }

    const hashedInput = hashPassword(password);
    if (admin.passwordHash !== hashedInput) {
      return { error: 'Invalid email or password' };
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('neetha_admin_session', JSON.stringify({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours session
      path: '/',
    });

    return { success: true };
  } catch (err: any) {
    console.error('Admin login error:', err);
    return { error: 'A database error occurred. Try again.' };
  }
}

/**
 * Log out admin
 */
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('neetha_admin_session');
  return { success: true };
}

/**
 * Get active Admin Session from cookies
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('neetha_admin_session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Update general Booking status
 */
export async function updateBookingStatus(bookingId: string, toStatus: string, notes?: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: 'Unauthorized session' };
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return { error: 'Booking not found' };

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: toStatus },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus,
          notes: notes || `Status updated by admin ${session.name}`,
          changedByAdminId: session.id,
        },
      }),
    ]);

    // Send WhatsApp notification on completion
    if (toStatus === 'COMPLETED') {
      const b = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true },
      });
      if (b) {
        await sendBookingCompleted(b.customer.phone, b.customer.name, b.bookingNumber, b.totalAmount);
      }
    }

    // Force Next.js to reload path data
    // In Next.js 15, revalidatePath updates cached server data instantly
    revalidatePath('/admin');
    revalidatePath(`/booking/status`);
    return { success: true };
  } catch (err: any) {
    console.error('Update status error:', err);
    return { error: 'Failed to update booking status' };
  }
}

/**
 * Assign a Nurse caregiver to a Booking request
 */
export async function assignNurse(bookingId: string, nurseId: string) {
  const session = await getAdminSession();
  if (!session) {
    return { error: 'Unauthorized session' };
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true },
    });

    if (!booking) return { error: 'Booking not found' };

    const nurse = await prisma.nurse.findUnique({
      where: { id: nurseId },
    });

    if (!nurse) return { error: 'Nurse not found' };

    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          nurseId,
          status: 'NURSE_ASSIGNED',
        },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: 'NURSE_ASSIGNED',
          notes: `Nurse ${nurse.name} allocated to this booking. Contact: ${nurse.phone}`,
          changedByAdminId: session.id,
        },
      }),
    ]);

    // Send WhatsApp notification
    await sendNurseAssignment(
      booking.customer.phone,
      booking.customer.name,
      booking.bookingNumber,
      nurse.name,
      nurse.phone
    );

    revalidatePath('/admin');
    revalidatePath(`/booking/status`);
    return { success: true };
  } catch (err: any) {
    console.error('Nurse assignment error:', err);
    return { error: 'Failed to allocate nurse' };
  }
}

/**
 * Update Service prices dynamically
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
 * Add / Edit Nurse details
 */
export async function upsertNurseRoster(data: {
  id?: string;
  name: string;
  phone: string;
  gender: string;
  qualification: string;
  experienceYears: number;
  skills: string;
  baseLocation?: string;
  status: string;
}) {
  const session = await getAdminSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    if (data.id) {
      // Update
      await prisma.nurse.update({
        where: { id: data.id },
        data: {
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          qualification: data.qualification,
          experienceYears: data.experienceYears,
          skills: data.skills,
          baseLocation: data.baseLocation || null,
          status: data.status,
        },
      });
    } else {
      // Create
      await prisma.nurse.create({
        data: {
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          qualification: data.qualification,
          experienceYears: data.experienceYears,
          skills: data.skills,
          baseLocation: data.baseLocation || null,
          status: data.status,
        },
      });
    }
    revalidatePath('/admin/roster');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save nurse profile. Verify phone is unique.' };
  }
}
