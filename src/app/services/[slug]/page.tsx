import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_SERVICES = [
  { id: 'fallback-1', name: 'IM/IV Injection Support', slug: 'im-iv-injections', basePrice: 350.0, priceUnit: 'visit', description: 'Administration of intramuscular or intravenous injections by a certified nurse at your home.' },
  { id: 'fallback-2', name: 'Wound & Surgical Dressing', slug: 'wound-surgical-dressing', basePrice: 450.0, priceUnit: 'visit', description: 'Sterile dressing changes for post-surgical wounds, diabetic ulcers, or other lacerations.' },
  { id: 'fallback-3', name: 'Urinary Catheter Change', slug: 'urinary-catheter-change', basePrice: 600.0, priceUnit: 'visit', description: 'Hygienic insertion, removal, or replacement of urinary catheters.' },
  { id: 'fallback-4', name: '24/7 Dedicated Nursing Care', slug: 'dedicated-24-7-nursing', basePrice: 2500.0, priceUnit: 'day', description: 'Continuous 24-hour round-the-clock shift nursing for critical or elderly patients.' },
  { id: 'fallback-5', name: 'IV Infusion & Hydration Therapy', slug: 'iv-infusion-hydration', basePrice: 500.0, priceUnit: 'visit', description: 'Setup and monitoring of intravenous fluids, vitamins, or hydration therapy at home.' },
  { id: 'fallback-6', name: 'At-Home IVF Injection Support', slug: 'at-home-ivf-support', basePrice: 400.0, priceUnit: 'visit', description: 'Scheduled daily hormone injections for IVF cycles administered timely by a nurse.' },
  { id: 'fallback-7', name: 'Post-Surgical Nursing Care', slug: 'post-surgical-care', basePrice: 1500.0, priceUnit: 'day', description: '12-hour or 24-hour recovery assistance including vitals monitoring, medications, and support.' },
  { id: 'fallback-8', name: 'Physiotherapy & Rehabilitation', slug: 'physiotherapy-rehab', basePrice: 800.0, priceUnit: 'visit', description: 'Home-based physical therapy exercises for stroke recovery, joint replacement, or mobility issues.' },
];

export const revalidate = 0;

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  let service = null;

  try {
    service = await prisma.service.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn('DB search failed. Trying fallbacks.');
  }

  if (!service) {
    service = FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs">
          <Link href="/" className="text-sm font-bold text-primary-700">Neetha Nursing Service</Link>
          <div className="flex gap-4">
            <Link href="/services" className="hover:text-primary-600">All Services</Link>
            <Link href="/booking" className="btn-primary py-1 px-3">Book Visit</Link>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto py-16 px-4 flex-1 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900">{service.name}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Rate Card */}
          <div className="bg-white border border-gray-100 p-6 rounded-xl space-y-4 text-center md:col-span-1 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Base Rate Pricing</span>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-primary-700 block">Rs. {service.basePrice}</span>
              <span className="text-xs text-gray-400">per {service.priceUnit}</span>
            </div>
            <div className="text-[10px] text-gray-400 bg-gray-50 py-1.5 px-2 rounded">
              Min. commitment: {service.minimumDays} {service.priceUnit}(s)
            </div>
            <Link
              href={`/booking/details?serviceId=${service.id}`}
              className="w-full inline-flex justify-center items-center py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors text-xs"
            >
              Book This Service
            </Link>
          </div>

          {/* Guidelines */}
          <div className="bg-white border border-gray-100 p-6 rounded-xl md:col-span-2 space-y-4 text-xs text-gray-600">
            <h3 className="font-bold text-gray-900 text-sm">What to Expect</h3>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Our caregiver will arrive in proper clinical attire carrying verified credentials and vaccination cards.</li>
              <li>Consumables like syringes, surgical spirits, cotton, or tapes are included under standard visits.</li>
              <li>Visits are scheduled under the strict guidance of local supervisors and patient doctors.</li>
              <li>Daily clinical vitals monitoring (Blood pressure, Pulse rate, SpO2 levels) is standard on all sessions.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
