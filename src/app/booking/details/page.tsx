import React from 'react';
import { prisma } from '@/lib/prisma';
import BookingDetailsForm from '@/components/booking/BookingDetailsForm';
import { redirect } from 'next/navigation';

interface DetailsPageProps {
  searchParams: Promise<{ serviceId?: string }>;
}

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

export default async function DetailsPage({ searchParams }: DetailsPageProps) {
  const { serviceId } = await searchParams;

  if (!serviceId) {
    redirect('/booking');
  }

  let service = null;

  try {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
  } catch (err) {
    console.warn('Database error when loading service. Trying fallbacks.');
  }

  // Fallback if not found in db (e.g. SQLite database not seeded yet)
  if (!service) {
    service = FALLBACK_SERVICES.find((s) => s.id === serviceId) || null;
  }

  if (!service) {
    redirect('/booking');
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-primary-50 border-b border-primary-100 py-3 px-6 flex justify-between items-center">
        <span className="text-sm font-semibold text-primary-800">Step 2 of 3: Patient & Booking Details</span>
        <div className="flex gap-1.5">
          <span className="w-6 h-1.5 rounded bg-primary-200"></span>
          <span className="w-6 h-1.5 rounded bg-primary-600"></span>
          <span className="w-6 h-1.5 rounded bg-gray-200"></span>
        </div>
      </div>

      <BookingDetailsForm
        serviceId={service.id}
        serviceName={service.name}
        basePrice={Number(service.basePrice)}
        priceUnit={service.priceUnit}
        minimumDays={service.minimumDays}
      />
    </div>
  );
}
