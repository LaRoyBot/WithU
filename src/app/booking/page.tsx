import React from 'react';
import { prisma } from '@/lib/prisma';
import QuickBookingForm from '@/components/booking/QuickBookingForm';

const FALLBACK_SERVICES = [
  {
    id: 'fallback-1',
    name: 'IM/IV Injection Support',
    slug: 'im-iv-injections',
    basePrice: 350.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-2',
    name: 'Wound & Surgical Dressing',
    slug: 'wound-surgical-dressing',
    basePrice: 450.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-3',
    name: 'Urinary Catheter Change',
    slug: 'urinary-catheter-change',
    basePrice: 600.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-4',
    name: '24/7 Dedicated Nursing Care',
    slug: 'dedicated-24-7-nursing',
    basePrice: 2500.0,
    priceUnit: 'day',
    minimumDays: 7,
  },
];

export const revalidate = 0;

export default async function QuickBookingPage() {
  let servicesList: any[] = [];
  try {
    servicesList = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.warn('Database error fetching services. Using fallbacks.');
  }

  const services = servicesList.length > 0 ? servicesList : FALLBACK_SERVICES;

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
