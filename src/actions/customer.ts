'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { decrypt } from '@/lib/crypto';
import { sendCustomerOtp } from '@/lib/whatsapp';
import { consumeCustomerOtpChallenge, createCustomerOtpChallenge, generateOtp, getCustomerIdentity, revokeCurrentSession, setSession } from '@/lib/auth';
import { allowAttempt } from '@/lib/rate-limit';

/**
 * 1. Request Customer Login OTP via Phone Number (WhatsApp / SMS)
 */
export async function requestCustomerOtp(phoneInput: string, channel: 'WHATSAPP' | 'SMS' = 'WHATSAPP') {
  const cleanPhone = phoneInput.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { error: 'Please enter a valid 10-digit mobile number' };
  }

  const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
  if (!allowAttempt('customer-otp-request', formattedPhone, 3, 15 * 60 * 1000)) {
    return { error: 'Too many verification requests. Please try again later.' };
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { phone: formattedPhone } });
    // Do not create personal-data records from a login request and do not reveal account existence.
    if (!customer) return { success: true, message: 'If an account exists for this number, a verification code has been sent.' };

    // Generate 6-digit OTP
    const otpCode = generateOtp();
    await createCustomerOtpChallenge(customer.id, otpCode, 10 * 60);

    // Send OTP via WhatsApp / SMS dispatch
    await sendCustomerOtp(formattedPhone, otpCode, channel);

    return {
      success: true,
      message: 'If an account exists for this number, a verification code has been sent.',
    };
  } catch (err: any) {
    console.error('Customer OTP generation error:', err);
    return { error: 'Failed to dispatch OTP. Please verify your phone number.' };
  }
}

/**
 * 2. Verify Customer OTP and create customer session
 */
export async function verifyCustomerOtp(enteredOtp: string) {
  if (!enteredOtp || enteredOtp.trim().length !== 6) {
    return { error: 'Please enter the complete 6-digit verification code' };
  }

  try {
    const customerId = await consumeCustomerOtpChallenge(enteredOtp.trim());
    if (!customerId) {
      return { error: 'Incorrect OTP. Please check the code sent to your phone.' };
    }

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      return { error: 'Customer record not found.' };
    }

    await setSession('CUSTOMER', customer.id, 60 * 60 * 24 * 14);

    return { success: true };
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return { error: 'Failed to verify OTP' };
  }
}

/**
 * 3. Get Logged in Customer Session
 */
export async function getCustomerSession() {
  const customer = await getCustomerIdentity();
  return customer ? { ...customer, address: customer.addressLine1 } : null;
}

/**
 * 4. Customer Logout
 */
export async function customerLogout() {
  await revokeCurrentSession('CUSTOMER');
  return { success: true };
}

/**
 * 5. Fetch Customer's Bookings and Assigned Caregivers
 */
export async function getCustomerBookings() {
  const session = await getCustomerSession();
  if (!session) {
    return { error: 'Unauthorized. Please login.' };
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { customerId: session.id },
      include: {
        service: true,
        nurse: {
          select: {
            name: true,
            phone: true,
            gender: true,
            qualification: true,
            experienceYears: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const parsedBookings = bookings.map((b) => {
      let decryptedPatientName = 'Patient';
      let decryptedConditions = '';

      try {
        decryptedPatientName = decrypt(b.patientName);
      } catch {}
      try {
        decryptedConditions = decrypt(b.medicalConditions);
      } catch {}

      return {
        id: b.id,
        bookingNumber: b.bookingNumber,
        serviceName: b.service.name,
        totalAmount: Number(b.totalAmount),
        status: b.status,
        shiftType: b.shiftType,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        totalDays: b.totalDays,
        area: b.area,
        patientName: decryptedPatientName,
        medicalConditions: decryptedConditions,
        assignedNurse: b.nurse ? {
          name: b.nurse.name,
          phone: b.nurse.phone,
          qualification: b.nurse.qualification,
          experienceYears: b.nurse.experienceYears,
        } : null,
        createdAt: b.createdAt.toISOString(),
      };
    });

    return { success: true, bookings: parsedBookings };
  } catch (err: any) {
    console.error('Fetch customer bookings error:', err);
    return { error: 'Failed to load bookings' };
  }
}
