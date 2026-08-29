'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { decrypt } from '@/lib/crypto';
import { sendCustomerOtp } from '@/lib/whatsapp';

/**
 * 1. Request Customer Login OTP via Phone Number (WhatsApp / SMS)
 */
export async function requestCustomerOtp(phoneInput: string, channel: 'WHATSAPP' | 'SMS' = 'WHATSAPP') {
  const cleanPhone = phoneInput.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { error: 'Please enter a valid 10-digit mobile number' };
  }

  const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;

  try {
    // Check if customer exists or create placeholder
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { phone: formattedPhone },
          { phone: cleanPhone },
          { phone: cleanPhone.slice(-10) },
        ],
      },
    });

    if (!customer) {
      // Allow new customers to also register/log in via OTP
      customer = await prisma.customer.create({
        data: {
          name: 'Patient / Family',
          phone: formattedPhone,
          addressLine1: 'Hyderabad',
          pincode: '500019',
          city: 'Hyderabad',
          consentGiven: true,
          consentTimestamp: new Date(),
          consentIpAddress: '127.0.0.1',
          consentVersion: 'v1.0-dpdp',
        },
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    // Store in cookie or temporary storage for verification
    const cookieStore = await cookies();
    cookieStore.set('neetha_customer_otp_challenge', JSON.stringify({
      customerId: customer.id,
      phone: formattedPhone,
      otpCode,
      expiresAt: otpExpires.getTime(),
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60, // 10 mins
      path: '/',
    });

    // Send OTP via WhatsApp / SMS dispatch
    await sendCustomerOtp(formattedPhone, otpCode, channel);

    return {
      success: true,
      message: `OTP sent successfully to ${formattedPhone} via ${channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS'}`,
      // For development/preview convenience in local environments without active WhatsApp credits
      devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
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

  const cookieStore = await cookies();
  const challengeCookie = cookieStore.get('neetha_customer_otp_challenge');

  if (!challengeCookie) {
    return { error: 'OTP expired or not requested. Please request a new code.' };
  }

  try {
    const challenge = JSON.parse(challengeCookie.value);
    if (Date.now() > challenge.expiresAt) {
      return { error: 'This OTP has expired. Please request a new one.' };
    }

    if (challenge.otpCode !== enteredOtp.trim()) {
      return { error: 'Incorrect OTP. Please check the code sent to your phone.' };
    }

    const customer = await prisma.customer.findUnique({
      where: { id: challenge.customerId },
    });

    if (!customer) {
      return { error: 'Customer record not found.' };
    }

    // Set Customer session cookie (14 days)
    cookieStore.set('neetha_customer_session', JSON.stringify({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.addressLine1,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 14, // 14 days
      path: '/',
    });

    // Clean up OTP challenge cookie
    cookieStore.delete('neetha_customer_otp_challenge');

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
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('neetha_customer_session');
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * 4. Customer Logout
 */
export async function customerLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('neetha_customer_session');
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
