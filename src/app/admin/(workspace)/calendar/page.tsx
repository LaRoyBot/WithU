import React from 'react';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import CalendarView from '@/components/admin/CalendarView';
import { getAdminSession } from '@/actions/admin';
import { redirect } from 'next/navigation';

export const revalidate = 0; // Dynamic data loading

export default async function AdminCalendarPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  let bookings: any[] = [];
  try {
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
        startDate: 'asc',
      },
    });

    bookings = rawBookings.map((b) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      status: b.status,
      patientName: decrypt(b.patientName),
      customer: {
        name: b.customer.name,
        phone: b.customer.phone,
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
  } catch (err) {
    console.error('Error fetching calendar bookings:', err);
  }

  return <CalendarView initialBookings={bookings} />;
}
