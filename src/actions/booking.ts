'use server';

import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';
import { bookingDetailsSchema, type BookingDetailsInput } from '@/lib/validations/booking';
import { sendBookingConfirmation } from '@/lib/whatsapp';
import { redirect } from 'next/navigation';

// Helper to generate a random 4-character uppercase alphanumeric string for booking ID suffix
function generateBookingNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NNS-${result}`;
}

/**
 * Step 2 Form Submission Server Action
 * Validates inputs, creates customer, encrypts health PII, and creates a pending booking.
 */
export async function createBookingRecord(input: BookingDetailsInput) {
  // 1. Validate Form Input
  const result = bookingDetailsSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  const data = result.data;

  try {
    // 2. Fetch the service to calculate correct pricing
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || !service.isActive) {
      return { success: false, globalError: 'The selected service is currently unavailable.' };
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // Calculate total days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays < service.minimumDays) {
      return {
        success: false,
        globalError: `Minimum booking duration for this service is ${service.minimumDays} days. Selected: ${totalDays} days.`,
      };
    }

    // Pricing calculation
    const totalAmount = Number(service.basePrice) * totalDays;

    // 3. Upsert Customer
    // Phone is unique, so we search by phone.
    const customer = await prisma.customer.upsert({
      where: { phone: data.customerPhone },
      update: {
        name: data.customerName,
        email: data.customerEmail || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        pincode: data.pincode,
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1', // Mock IP
        consentVersion: 'v1.0-dpdp',
      },
      create: {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        pincode: data.pincode,
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1',
        consentVersion: 'v1.0-dpdp',
      },
    });

    // 4. Generate random OTP (6-digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // 5. Encrypt Sensitive Clinical Data (PHI) at the Application Level
    // We encrypt Patient Name, Medical Conditions, and Special Instructions.
    // Customer Name and Phone remain unencrypted for admin panel searching/indexing.
    const encryptedPatientName = encrypt(data.patientName);
    const encryptedMedicalConditions = encrypt(data.medicalConditions);
    const encryptedSpecialInstructions = data.specialInstructions ? encrypt(data.specialInstructions) : null;

    // 6. Generate unique booking number
    let bookingNumber = generateBookingNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.booking.findUnique({
        where: { bookingNumber },
      });
      if (!existing) {
        isUnique = true;
      } else {
        bookingNumber = generateBookingNumber();
        attempts++;
      }
    }

    // 7. Create Booking row in PENDING_OTP status
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        serviceId: service.id,
        startDate: start,
        endDate: end,
        shiftType: data.shiftType,
        totalDays,
        totalAmount,
        patientName: encryptedPatientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        medicalConditions: encryptedMedicalConditions,
        specialInstructions: encryptedSpecialInstructions,
        status: 'PENDING_OTP',
        otpCode,
        otpExpires,
      },
    });

    // Log the OTP in server console for local testing (mocking SMS delivery)
    console.log(`[SMS OTP SERVICE MOCK] OTP for booking ${bookingNumber} (Phone: ${data.customerPhone}) is: ${otpCode}`);

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return { success: false, globalError: 'A database error occurred. Please try again.' };
  }
}

/**
 * Step 3: Verify OTP Server Action
 * Validates the entered OTP code and transitions booking status to CONFIRMED.
 */
export async function verifyBookingOtp(bookingId: string, otpCode: string) {
  if (!bookingId || !otpCode) {
    return { success: false, error: 'Invalid verification details' };
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, service: true },
    });

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status !== 'PENDING_OTP') {
      return { success: false, error: 'This booking has already been verified or processed' };
    }

    // Verify OTP code & expiration
    if (booking.otpCode !== otpCode) {
      return { success: false, error: 'Invalid verification code' };
    }

    if (booking.otpExpires && new Date() > booking.otpExpires) {
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    // Update Booking status to CONFIRMED and clear OTP columns
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          otpCode: null,
          otpExpires: null,
        },
      }),
      // Write Status Audit Log
      prisma.bookingStatusEvent.create({
        data: {
          bookingId: booking.id,
          fromStatus: 'PENDING_OTP',
          toStatus: 'CONFIRMED',
          notes: 'Customer verified phone number via OTP',
        },
      }),
    ]);

    // Send WhatsApp notification
    await sendBookingConfirmation(
      booking.customer.phone,
      booking.customer.name,
      booking.bookingNumber,
      booking.service.name
    );

    return { success: true, bookingNumber: booking.bookingNumber };
  } catch (err: any) {
    console.error('OTP verification error:', err);
    return { success: false, error: 'System error during verification. Please try again.' };
  }
}

/**
 * Step 3: Resend OTP Server Action
 * Regenerates code, updates expires, and logs mock SMS message.
 */
export async function resendBookingOtp(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking || booking.status !== 'PENDING_OTP') {
      return { success: false, error: 'Invalid booking state' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        otpCode,
        otpExpires,
      },
    });

    console.log(`[SMS OTP SERVICE MOCK] Resent OTP for booking ${booking.bookingNumber} (Phone: ${booking.customer.phone}) is: ${otpCode}`);

    return { success: true };
  } catch (err: any) {
    console.error('OTP resending error:', err);
    return { success: false, error: 'Could not resend OTP. Try again.' };
  }
}

/**
 * Simplified Booking Form Submission Server Action
 * Creates Customer, Encrypts PHI, and places booking directly into CONFIRMED status.
 */
export async function createQuickBooking(data: {
  name: string;
  phone: string;
  serviceId: string;
  serviceNotes: string;
  dateNeeded: string;
  message: string;
}) {
  if (!data.name || !data.phone || !data.serviceId || !data.dateNeeded) {
    return { success: false, error: 'Please fill in all required fields' };
  }

  // Normalize phone (E.164 format)
  const phone = data.phone.startsWith('+91')
    ? data.phone
    : (data.phone.startsWith('+') ? data.phone : `+91${data.phone}`);

  try {
    // 1. Fetch Service to calculate pricing
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service || !service.isActive) {
      return { success: false, error: 'The selected service is currently unavailable.' };
    }

    const start = new Date(data.dateNeeded);
    start.setHours(0, 0, 0, 0);
    const end = new Date(data.dateNeeded);
    end.setHours(23, 59, 59, 999);

    const totalDays = 1;
    const totalAmount = Number(service.basePrice);

    // 2. Upsert Customer
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        name: data.name,
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1',
        consentVersion: 'v1.0-dpdp',
      },
      create: {
        name: data.name,
        phone,
        addressLine1: 'Quick onboarding booking form',
        pincode: '500019',
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1',
        consentVersion: 'v1.0-dpdp',
      },
    });

    // 3. Generate Unique Booking Number
    let bookingNumber = generateBookingNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.booking.findUnique({
        where: { bookingNumber },
      });
      if (!existing) {
        isUnique = true;
      } else {
        bookingNumber = generateBookingNumber();
        attempts++;
      }
    }

    // 4. Encrypt sensitive patient PII
    const encryptedPatientName = encrypt(data.name);
    const encryptedMedicalConditions = encrypt(
      `Service Custom Details: ${data.serviceNotes || 'None'}. Message: ${data.message || 'None'}`
    );
    const encryptedSpecialInstructions = encrypt('Submitted via simplified booking widget.');

    // 5. Create Booking directly in CONFIRMED status
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        serviceId: service.id,
        startDate: start,
        endDate: end,
        shiftType: 'DAY_12HR',
        totalDays,
        totalAmount,
        patientName: encryptedPatientName,
        patientAge: 60, // default/fallback for onboarding
        patientGender: 'Other',
        medicalConditions: encryptedMedicalConditions,
        specialInstructions: encryptedSpecialInstructions,
        status: 'CONFIRMED', // Immediately confirmed
      },
    });

    // 6. Log a status event record
    await prisma.bookingStatusEvent.create({
      data: {
        bookingId: booking.id,
        fromStatus: 'PENDING_OTP',
        toStatus: 'CONFIRMED',
        notes: 'Booking created directly via simplified landing page form.',
      },
    });

    // 7. Send WhatsApp alert stub
    try {
      await sendBookingConfirmation(phone, data.name, bookingNumber, service.name);
    } catch (err) {
      console.warn('WhatsApp CSP send failure:', err);
    }

    return { success: true, bookingId: booking.id, bookingNumber };
  } catch (err: any) {
    console.error('Quick booking creation error:', err);
    return { success: false, error: 'A database error occurred. Please try again.' };
  }
}
