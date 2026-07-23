import React from 'react';
import { prisma } from '@/lib/prisma';
import QuickBookingForm from '@/components/booking/QuickBookingForm';

export const revalidate = 0;

export default async function QuickBookingPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.error('Database error fetching services:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">On-Demand Care Booking</h1>
          <p className="text-xs text-slate-500 mt-1">Please enter your patient details below. Booking confirmation is immediate.</p>
        </div>
        <QuickBookingForm services={services} />
      </div>
    </div>
  );
}
