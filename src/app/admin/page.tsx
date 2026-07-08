import React from 'react';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import BookingsQueue from '@/components/admin/BookingsQueue';

export const revalidate = 0; // Dynamic data loading

export default async function AdminDashboardPage() {
  let bookings: any[] = [];
  let nurses: any[] = [];

  try {
    // 1. Fetch bookings that are verified (exclude PENDING_OTP)
    const rawBookings = await prisma.booking.findMany({
      where: {
        status: {
          not: 'PENDING_OTP',
        },
      },
      include: {
        customer: true,
        service: true,
        nurse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Decrypt Clinical PII/PHI fields at Server side before forwarding to client component
    bookings = rawBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      shiftType: b.shiftType,
      totalDays: b.totalDays,
      totalAmount: Number(b.totalAmount),
      status: b.status,
      paymentStatus: b.paymentStatus,
      patientName: decrypt(b.patientName),
      patientAge: b.patientAge,
      patientGender: b.patientGender,
      medicalConditions: decrypt(b.medicalConditions),
      specialInstructions: b.specialInstructions ? decrypt(b.specialInstructions) : null,
      customer: {
        name: b.customer.name,
        phone: b.customer.phone,
        addressLine1: b.customer.addressLine1,
        pincode: b.customer.pincode,
      },
      service: {
        name: b.service.name,
      },
      nurse: b.nurse
        ? {
            id: b.nurse.id,
            name: b.nurse.name,
            phone: b.nurse.phone,
          }
        : null,
    }));

    // 3. Fetch active nurses for the assignment list
    const rawNurses = await prisma.nurse.findMany({
      where: {
        status: 'ACTIVE',
      },
    });

    nurses = rawNurses.map((n) => ({
      id: n.id,
      name: n.name,
      phone: n.phone,
      skills: `${n.qualification} | Exp: ${n.experienceYears} Yrs`,
    }));

  } catch (err) {
    console.error('Database connection error in admin dashboard:', err);
  }

  return (
    <BookingsQueue
      initialBookings={bookings}
      activeNurses={nurses}
    />
  );
}
