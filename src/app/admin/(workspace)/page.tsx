import React from 'react';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import BookingsQueue from '@/components/admin/BookingsQueue';

export const revalidate = 0; // Dynamic data loading

export default async function AdminDashboardPage() {
  let bookings: any[] = [];
  let nurses: any[] = [];

  try {
    // 1. Fetch bookings including relations and jobClaims
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
        jobClaims: {
          include: {
            nurse: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Decrypt Clinical PII/PHI fields at Server side
    bookings = rawBookings.map((b) => {
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
        id: b.id,
        bookingNumber: b.bookingNumber,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        shiftType: b.shiftType,
        totalDays: b.totalDays,
        totalAmount: Number(b.totalAmount),
        status: b.status,
        paymentStatus: b.paymentStatus,
        patientName,
        patientAge: b.patientAge,
        patientGender: b.patientGender,
        medicalConditions,
        specialInstructions,
        prescriptionUrl: b.prescriptionUrl,
        area: b.area,
        customer: {
          name: b.customer.name,
          phone: b.customer.phone,
          addressLine1: b.customer.addressLine1,
          pincode: b.customer.pincode,
        },
        service: {
          id: b.service.id,
          name: b.service.name,
        },
        nurse: b.nurse
          ? {
              id: b.nurse.id,
              name: b.nurse.name,
              phone: b.nurse.phone,
            }
          : null,
        jobClaims: b.jobClaims.map((c) => ({
          id: c.id,
          proposedPrice: Number(c.proposedPrice),
          proposedArea: c.proposedArea,
          proposedTime: c.proposedTime,
          status: c.status,
          notes: c.notes,
          nurse: {
            id: c.nurse.id,
            name: c.nurse.name,
            phone: c.nurse.phone,
            qualification: c.nurse.qualification,
          },
        })),
      };
    });

    // 3. Fetch approved active nurses for the direct assignment list
    const rawNurses = await prisma.nurse.findMany({
      where: {
        status: 'ACTIVE',
        isApproved: true,
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
