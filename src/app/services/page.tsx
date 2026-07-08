import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const revalidate = 0;

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.warn('DB not loaded. Using fallbacks.');
  }

  // Fallbacks if DB empty
  if (services.length === 0) {
    services = [
      { id: 'fallback-1', name: 'IM/IV Injection Support', slug: 'im-iv-injections', basePrice: 350.0, priceUnit: 'visit', description: 'Administration of intramuscular or intravenous injections by a certified nurse at your home.' },
      { id: 'fallback-2', name: 'Wound & Surgical Dressing', slug: 'wound-surgical-dressing', basePrice: 450.0, priceUnit: 'visit', description: 'Sterile dressing changes for post-surgical wounds, diabetic ulcers, or other lacerations.' },
      { id: 'fallback-3', name: 'Urinary Catheter Change', slug: 'urinary-catheter-change', basePrice: 600.0, priceUnit: 'visit', description: 'Hygienic insertion, removal, or replacement of urinary catheters.' },
      { id: 'fallback-4', name: '24/7 Dedicated Nursing Care', slug: 'dedicated-24-7-nursing', basePrice: 2500.0, priceUnit: 'day', description: 'Continuous 24-hour round-the-clock shift nursing for critical or elderly patients.' },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs">
          <Link href="/" className="text-sm font-bold text-primary-700">Neetha Nursing Service</Link>
          <Link href="/booking" className="btn-primary py-1 px-3">Book Visit</Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Our Home Care Catalog</h1>
          <p className="text-xs text-gray-500 mt-2">Transparent pricing plans and commit schedules for home clinical treatments.</p>
        </div>

        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                <p className="text-xs text-gray-500 max-w-xl leading-relaxed">{service.description}</p>
              </div>
              <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-3 text-right">
                <div>
                  <span className="text-sm font-bold text-primary-700 block">Rs. {Number(service.basePrice)}</span>
                  <span className="text-[10px] text-gray-400">per {service.priceUnit}</span>
                </div>
                <Link
                  href={`/booking/details?serviceId=${service.id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
