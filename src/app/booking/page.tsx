import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Static fallback data in case database is not seeded yet
const FALLBACK_SERVICES = [
  {
    id: 'fallback-1',
    name: 'IM/IV Injection Support',
    slug: 'im-iv-injections',
    description: 'Administration of intramuscular or intravenous injections by a certified nurse at your home.',
    basePrice: 350.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-2',
    name: 'Wound & Surgical Dressing',
    slug: 'wound-surgical-dressing',
    description: 'Sterile dressing changes for post-surgical wounds, diabetic ulcers, or other lacerations.',
    basePrice: 450.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-3',
    name: 'Urinary Catheter Change',
    slug: 'urinary-catheter-change',
    description: 'Hygienic insertion, removal, or replacement of urinary catheters.',
    basePrice: 600.0,
    priceUnit: 'visit',
    minimumDays: 1,
  },
  {
    id: 'fallback-4',
    name: '24/7 Dedicated Nursing Care',
    slug: 'dedicated-24-7-nursing',
    description: 'Continuous 24-hour round-the-clock shift nursing for critical or elderly patients.',
    basePrice: 2500.0,
    priceUnit: 'day',
    minimumDays: 7,
  },
];

export const revalidate = 0; // Disable cache to reflect dynamic DB additions

export default async function SelectServicePage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
    });
  } catch (err) {
    console.warn('Database not initialized or empty. Using fallback services for preview.');
  }

  const servicesList = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-primary-50 border-b border-primary-100 py-3 px-6 flex justify-between items-center">
        <span className="text-sm font-semibold text-primary-800">Step 1 of 3: Select Service</span>
        <div className="flex gap-1.5">
          <span className="w-6 h-1.5 rounded bg-primary-600"></span>
          <span className="w-6 h-1.5 rounded bg-gray-200"></span>
          <span className="w-6 h-1.5 rounded bg-gray-200"></span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Choose a Care Service</h1>
          <p className="text-sm text-gray-500 mt-1">Select the home healthcare service required. Prices are transparent, verified upfront, and inclusive of standard consumables.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 hover:border-primary-500 rounded-lg p-5 flex flex-col justify-between transition-all hover:shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-gray-900 text-base leading-snug">{service.name}</h3>
                  <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded border border-primary-100 shrink-0">
                    Rs. {service.basePrice}/{service.priceUnit}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3">{service.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-1 rounded">Min. Commitment: {service.minimumDays} {service.minimumDays === 1 ? service.priceUnit : `${service.priceUnit}s`}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-50">
                <Link
                  href={`/booking/details?serviceId=${service.id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
                >
                  Select & Continue →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
