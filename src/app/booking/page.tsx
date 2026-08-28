import React from 'react';
import { prisma } from '@/lib/prisma';
import TwoStepBookingForm, { ServiceOption } from '@/components/booking/TwoStepBookingForm';

export const revalidate = 0;

export default async function BookingPage() {
  let services: ServiceOption[] = [];
  try {
    const rawServices = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    services = rawServices.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      basePrice: Number(s.basePrice),
      priceUnit: s.priceUnit,
    }));
  } catch (err) {
    console.error('Database error fetching services for booking page:', err);
    // Fallback default services if database is unreachable
    services = [
      {
        id: 'fallback-icu',
        name: 'Critical ICU & Tracheostomy Care (24h)',
        description: 'Bedside intensive care with patient monitoring & suctioning',
        basePrice: 2800,
        priceUnit: 'day',
      },
      {
        id: 'fallback-elderly',
        name: 'Elderly & Bedridden Assisted Care (12h)',
        description: 'Assisted daily living, mobility support, medication management',
        basePrice: 1500,
        priceUnit: 'day',
      },
      {
        id: 'fallback-postop',
        name: 'Post-Surgical Wound Dressing & Recovery',
        description: 'Sterile surgical site care, drainage management, vitals tracking',
        basePrice: 850,
        priceUnit: 'visit',
      },
      {
        id: 'fallback-palliative',
        name: 'Palliative & Oncology Comfort Care',
        description: 'Compassionate pain management & continuous vitals oversight',
        basePrice: 2400,
        priceUnit: 'day',
      },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <span>✨</span> Instant Nurse Coordination in Hyderabad
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Book In-Home Nursing Care
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Experienced, verified GNM / BSc nurses dispatched directly to your doorstep.
          </p>
        </div>

        <TwoStepBookingForm services={services} />
      </div>
    </div>
  );
}
