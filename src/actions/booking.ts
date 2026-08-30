'use server';

import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/crypto';
import { bookingDetailsSchema, type BookingDetailsInput } from '@/lib/validations/booking';
import { sendBookingConfirmation, sendAdminNewBookingAlert } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';

// Helper to generate a random 4-character uppercase alphanumeric string for booking ID suffix
const generateBookingNumber = (): string =>
  `NNS-${Array.from({ length: 4 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}`;

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
  prescriptionUrl?: string;
  promoCode?: string;
  paymentMode?: 'PAY_NOW' | 'PAY_AFTER';
  utrNumber?: string;
}) {
  if (!data.name?.trim() || !data.phone?.trim() || !data.area?.trim()) {
    return { success: false, error: 'Name, phone number, and area are required.' };
  }

  // Normalize phone number to E.164 (+91)
  const rawPhone = data.phone.replace(/\D/g, '');
  if (rawPhone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit Indian phone number.' };
  }
  const cleanPhone = rawPhone.length === 10 ? `+91${rawPhone}` : (data.phone.startsWith('+') ? data.phone : `+${rawPhone}`);

  try {
    // 1. Fetch Service and compute initial price (or fallback for Custom / Other service)
    let service = null;
    if (data.serviceId && data.serviceId !== 'other') {
      try {
        service = await prisma.service.findUnique({
          where: { id: data.serviceId },
        });
      } catch (err) {
        console.warn('Could not fetch service by ID:', err);
      }
    }

    // If no serviceId was selected, or "other" was chosen, find or create generic consultation service
    if (!service) {
      service = await prisma.service.findFirst({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });

      // If still no service in database, fallback default
      if (!service) {
        service = {
          id: 'custom-general-care',
          name: data.customService?.trim() || 'General Home Nursing Consultation',
          basePrice: 500 as any,
          priceUnit: 'visit',
          isActive: true,
        } as any;
      }
    }

    const serviceDisplayName = data.serviceId === 'other' && data.customService?.trim()
      ? `Other: ${data.customService.trim()}`
      : (data.serviceId ? service.name : 'Home Nursing Consultation');

    let calculatedPrice = Number(service.basePrice) || 500;

    // Apply promo code discount if valid
    if (data.promoCode && data.promoCode.trim().toUpperCase() === 'WITHU10') {
      calculatedPrice = Math.max(0, calculatedPrice * 0.9); // 10% discount
    }

    // 2. Upsert Customer Record
    const customer = await prisma.customer.upsert({
      where: { phone: cleanPhone },
      update: {
        name: data.name.trim(),
        addressLine1: data.area?.trim() || 'Hyderabad Area',
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1',
        consentVersion: 'v1.0-dpdp',
      },
      create: {
        name: data.name.trim(),
        phone: cleanPhone,
        addressLine1: data.area?.trim() || 'Hyderabad Area',
        pincode: '500001',
        consentGiven: true,
        consentTimestamp: new Date(),
        consentIpAddress: '127.0.0.1',
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
      `Area/Location: ${data.area.trim()}`,
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

    // 5. Create Booking in CONFIRMED state for Admin queue & Open Job Board
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
        area: data.area.trim(),
        promoCode: data.promoCode?.trim() || null,
        prescriptionUrl: data.prescriptionUrl || null,
        patientName: encryptedPatientName,
        patientAge: 45, // default
        patientGender: 'Other',
        medicalConditions: encryptedConditions,
        specialInstructions: encryptedInstructions,
        status: 'CONFIRMED', // Immediately placed in open job board / queue
      },
    });

    // 6. Write status event audit
    await prisma.bookingStatusEvent.create({
      data: {
        bookingId: booking.id,
        fromStatus: 'PENDING_OTP',
        toStatus: 'CONFIRMED',
        notes: `Public booking submitted by customer. Area: ${data.area}, Service: ${serviceDisplayName}, Promo: ${data.promoCode || 'None'}`,
      },
    });

    // 7. Automated Forwarding to Admin WhatsApp
    try {
      await sendAdminNewBookingAlert({
        bookingNumber,
        customerName: data.name.trim(),
        customerPhone: cleanPhone,
        area: data.area.trim(),
        serviceName: serviceDisplayName,
        price: calculatedPrice,
        promoCode: data.promoCode?.trim(),
        message: clinicalNotes,
        hasPrescription: !!data.prescriptionUrl,
      });
    } catch (waErr) {
      console.warn('Admin WhatsApp dispatch error (logged safely):', waErr);
    }

    // 8. Send immediate acknowledgement to customer
    try {
      await sendBookingConfirmation(cleanPhone, data.name.trim(), bookingNumber, serviceDisplayName);
    } catch (custWaErr) {
      console.warn('Customer WhatsApp acknowledgement error:', custWaErr);
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

    // 3. Upsert Customer
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
        consentIpAddress: '127.0.0.1',
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

    console.log(`[SMS OTP SERVICE MOCK] OTP for booking ${bookingNumber} (Phone: ${data.customerPhone}) is: ${otpCode}`);

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
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking || booking.status !== 'PENDING_OTP') {
      return { success: false, error: 'Invalid booking state' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

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
