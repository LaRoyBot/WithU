'use server';

import { prisma } from '@/lib/prisma';
import { decrypt, encrypt } from '@/lib/crypto';
import { bookingDetailsSchema, publicBookingSchema, type BookingDetailsInput } from '@/lib/validations/booking';
import { sendAdminNewBookingAlert, sendBookingConfirmation, sendCustomerOtp, isWhatsAppConfigured } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { allowAttempt } from '@/lib/rate-limit';

// Helper to hash verification OTP codes before DB storage
const hashOtp = (code: string): string =>
  createHash('sha256').update(code).digest('hex');

// Helper to generate a random 4-character uppercase alphanumeric string for booking ID suffix
const generateBookingNumber = (): string =>
  `NNS-${randomBytes(5).toString('hex').toUpperCase()}`;

/**
 * Flow 5: Public Two-Step Booking Form Server Action
 * Handles Step 1 & Step 2 complete payload, stores encrypted health data,
 * and automatically dispatches the lead packet to Admin's WhatsApp.
 */
export async function submitPublicBooking(data: {
  name: string;
  phone: string;
  area?: string;
  serviceId?: string;
  customService?: string;
  dateNeeded?: string;
  message?: string;
  promoCode?: string;
  paymentMode?: 'PAY_NOW' | 'PAY_AFTER';
  utrNumber?: string;
  consentGiven?: true;
}) {
  const validated = publicBookingSchema.safeParse(data);
  if (!validated.success) return { success: false, error: 'Please provide valid booking details and consent to data processing.' };
  data = validated.data;

  // Normalize phone number to E.164 (+91)
  const rawPhone = data.phone.replace(/\D/g, '');
  if (rawPhone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit Indian phone number.' };
  }
  const cleanPhone = rawPhone.length === 10 ? `+91${rawPhone}` : (data.phone.startsWith('+') ? data.phone : `+${rawPhone}`);
  if (!allowAttempt('public-booking', cleanPhone, 3, 60 * 60 * 1000)) {
    return { success: false, error: 'Too many booking attempts. Please try again later.' };
  }

  try {
    const service = await prisma.service.findFirst({ where: { id: data.serviceId, isActive: true } });
    if (!service) return { success: false, error: 'The selected service is unavailable.' };

    const serviceDisplayName = service.name;

    let calculatedPrice = Number(service.basePrice);

    // Apply promo code discount if valid
    if (data.promoCode && data.promoCode.trim().toUpperCase() === 'WITHU10') {
      calculatedPrice = Math.max(0, calculatedPrice * 0.9); // 10% discount
    }

    // 2. Upsert Customer Record without overwriting established profiles before OTP verification
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: cleanPhone },
    });

    const customer = existingCustomer
      ? existingCustomer
      : await prisma.customer.create({
          data: {
            name: data.name.trim(),
            phone: cleanPhone,
            addressLine1: data.area!.trim(),
            pincode: '500001',
            consentGiven: true,
            consentTimestamp: new Date(),
            consentIpAddress: null,
            consentVersion: 'v1.0-dpdp',
          },
        });

    // 3. Generate unique booking number
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

    // 4. Encrypt Clinical/Sensitive PHI
    const paymentNotes = [
      data.paymentMode === 'PAY_NOW' ? 'Payment Mode: Online (UPI - Pay Now)' : 'Payment Mode: Doorstep (Pay After Visit)',
      data.utrNumber ? `UTR / Ref: ${data.utrNumber.trim()}` : null,
    ].filter(Boolean).join(' | ');

    const clinicalNotes = [
      `Area/Location: ${data.area!.trim()}`,
      data.dateNeeded ? `Date Needed: ${data.dateNeeded}` : null,
      data.customService ? `Requested Custom Service: ${data.customService.trim()}` : null,
      paymentNotes,
      data.message ? `Message: ${data.message.trim()}` : null,
    ].filter(Boolean).join(' | ');

    const encryptedPatientName = encrypt(data.name.trim());
    const encryptedConditions = encrypt(clinicalNotes);
    const encryptedInstructions = data.message ? encrypt(data.message.trim()) : null;

    const startDate = data.dateNeeded ? new Date(data.dateNeeded) : new Date();
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // 1-day minimum

    // 5. Determine whether messaging gateway is configured
    const messagingConfigured = isWhatsAppConfigured();
    let otpSent = false;
    const otpCode = String(randomInt(100000, 1000000));

    if (messagingConfigured) {
      try {
        otpSent = await sendCustomerOtp(cleanPhone, otpCode);
      } catch (err) {
        console.warn('[BOOKING OTP] Dispatch failed:', err);
        otpSent = false;
      }
    } else {
      console.warn('[BOOKING OTP] WhatsApp/SMS integration unconfigured. Falling back to direct lead capture.');
    }

    const initialStatus = otpSent ? 'PENDING_OTP' : 'CONFIRMED';

    // Create Booking row
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: customer.id,
        serviceId: service.id,
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        endDate: isNaN(endDate.getTime()) ? new Date(Date.now() + 86400000) : endDate,
        shiftType: 'DAY_12HR',
        totalDays: 1,
        totalAmount: calculatedPrice,
        area: data.area!.trim(),
        promoCode: data.promoCode?.trim() || null,
        prescriptionUrl: null,
        patientName: encryptedPatientName,
        patientAge: 45, // default
        patientGender: 'Other',
        medicalConditions: encryptedConditions,
        specialInstructions: encryptedInstructions,
        status: initialStatus,
        otpCode: otpSent ? hashOtp(otpCode) : null,
        otpExpires: otpSent ? new Date(Date.now() + 5 * 60 * 1000) : null,
      },
    });

    // 6. Write status event audit
    await prisma.bookingStatusEvent.create({
      data: {
        bookingId: booking.id,
        fromStatus: 'PENDING',
        toStatus: initialStatus,
        notes: otpSent
          ? 'Public booking submitted; awaiting phone OTP verification.'
          : 'Public booking captured directly for admin coordination (SMS/WhatsApp gateway offline).',
      },
    });

    // 7. Dispatch lead alert to Admin if configured
    if (messagingConfigured) {
      try {
        await sendAdminNewBookingAlert({
          bookingNumber,
          customerName: data.name.trim(),
          customerPhone: cleanPhone,
          area: data.area!.trim(),
          serviceName: serviceDisplayName,
          price: calculatedPrice,
          promoCode: data.promoCode?.trim(),
          message: clinicalNotes,
          hasPrescription: false,
        });
      } catch (adminAlertErr) {
        console.warn('[ADMIN ALERT] Failed to notify admin via WhatsApp:', adminAlertErr);
      }
    }

    revalidatePath('/admin');
    revalidatePath('/employee');

    return {
      success: true,
      bookingId: booking.id,
      bookingNumber,
      customerName: data.name.trim(),
      customerPhone: cleanPhone,
      serviceName: serviceDisplayName,
      totalAmount: calculatedPrice,
      requiresVerification: otpSent,
    };
  } catch (err: any) {
    console.error('Public booking submission error:', err);
    return { success: false, error: 'A server error occurred while processing your booking. Please try again.' };
  }
}

/**
 * Step 2 Form Submission Server Action (Legacy / Multi-day Full Onboarding)
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

    // 3. Upsert Customer without mutating existing profile before verification
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: data.customerPhone },
    });

    const customer = existingCustomer
      ? existingCustomer
      : await prisma.customer.create({
          data: {
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
    const otpCode = String(randomInt(100000, 1000000));
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // 5. Encrypt Sensitive Clinical Data (PHI)
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

    // 7. Create Booking row in PENDING_OTP status with hashed OTP
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
        otpCode: hashOtp(otpCode),
        otpExpires,
      },
    });

    await sendCustomerOtp(data.customerPhone, otpCode);

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return { success: false, globalError: 'A database error occurred. Please try again.' };
  }
}

/**
 * Step 3: Verify OTP Server Action
 */
export async function verifyBookingOtp(bookingId: string, otpCode: string) {
  if (!bookingId || !otpCode) {
    return { success: false, error: 'Invalid verification details' };
  }
  if (!allowAttempt('booking-otp', bookingId, 5, 15 * 60 * 1000)) {
    return { success: false, error: 'Too many verification attempts. Please request a new code later.' };
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

    // Verify OTP code & expiration (supports SHA-256 hashed OTPs and legacy plain codes)
    const providedOtpHash = hashOtp(otpCode);
    const isValidOtp = booking.otpCode === providedOtpHash || booking.otpCode === otpCode;
    if (!isValidOtp) {
      return { success: false, error: 'Invalid verification code' };
    }

    if (booking.otpExpires && new Date() > booking.otpExpires) {
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    let customerAddress = booking.area || booking.customer.addressLine1;
    let customerName = booking.customer.name;
    try {
      const decryptedName = decrypt(booking.patientName);
      if (decryptedName) customerName = decryptedName;
    } catch {}

    // Update Booking status to CONFIRMED, clear OTP columns, and update customer profile securely upon verification
    await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          otpCode: null,
          otpExpires: null,
        },
      }),
      prisma.customer.update({
        where: { id: booking.customerId },
        data: {
          name: customerName,
          addressLine1: customerAddress,
          consentGiven: true,
          consentTimestamp: new Date(),
          consentVersion: 'v1.0-dpdp',
        },
      }),
      prisma.bookingStatusEvent.create({
        data: {
          bookingId: booking.id,
          fromStatus: 'PENDING_OTP',
          toStatus: 'CONFIRMED',
          notes: 'Customer verified phone number via OTP',
        },
      }),
    ]);

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
 */
export async function resendBookingOtp(bookingId: string) {
  if (!allowAttempt('booking-otp-resend', bookingId, 3, 15 * 60 * 1000)) {
    return { success: false, error: 'Too many resend attempts. Please try again later.' };
  }
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking || booking.status !== 'PENDING_OTP') {
      return { success: false, error: 'Invalid booking state' };
    }

    const otpCode = String(randomInt(100000, 1000000));
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        otpCode: hashOtp(otpCode),
        otpExpires,
      },
    });

    await sendCustomerOtp(booking.customer.phone, otpCode);

    return { success: true };
  } catch (err: any) {
    console.error('OTP resending error:', err);
    return { success: false, error: 'Could not resend OTP. Try again.' };
  }
}

/**
 * Simplified Booking Form Submission Server Action (Homepage Quick Booking)
 */
export async function createQuickBooking(data: {
  name: string;
  phone: string;
  area: string;
  serviceId?: string;
  customService?: string;
  dateNeeded?: string;
  message?: string;
}) {
  return submitPublicBooking({
    name: data.name,
    phone: data.phone,
    area: data.area,
    serviceId: data.serviceId,
    customService: data.customService,
    dateNeeded: data.dateNeeded,
    message: data.message,
  });
}
