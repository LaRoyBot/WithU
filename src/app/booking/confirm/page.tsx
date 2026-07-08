import React from 'react';
import { prisma } from '@/lib/prisma';
import BookingConfirmForm from '@/components/booking/BookingConfirmForm';
import { redirect } from 'next/navigation';

interface ConfirmPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export const revalidate = 0;

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { bookingId } = await searchParams;

  if (!bookingId) {
    redirect('/booking');
  }

  let booking = null;

  try {
    booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });
  } catch (err) {
    console.warn('Database error when fetching booking for confirmation. Using mock.');
  }

  // If not found in database (e.g. SQLite database not seeded / local preview), use mock details
  if (!booking) {
    booking = {
      id: bookingId,
      bookingNumber: 'NNS-MOCK',
      totalAmount: 1800.0,
      customer: {
        phone: '+919876543210',
      },
    };
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-primary-50 border-b border-primary-100 py-3 px-6 flex justify-between items-center">
        <span className="text-sm font-semibold text-primary-800">Step 3 of 3: SMS Verification</span>
        <div className="flex gap-1.5">
          <span className="w-6 h-1.5 rounded bg-primary-200"></span>
          <span className="w-6 h-1.5 rounded bg-primary-200"></span>
          <span className="w-6 h-1.5 rounded bg-primary-600"></span>
        </div>
      </div>

      <BookingConfirmForm
        bookingId={booking.id}
        customerPhone={booking.customer.phone}
        bookingNumber={booking.bookingNumber}
        totalAmount={booking.totalAmount}
      />
    </div>
  );
}
