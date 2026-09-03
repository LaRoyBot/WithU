import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Shield } from 'lucide-react';

export interface LocationHub {
  slug: string;
  name: string;
  pincode: string;
  dispatchTime: string;
  description: string;
  popularServices: string[];
}

export const HYDERABAD_LOCALITIES: LocationHub[] = [
  {
    slug: 'lingampally',
    name: 'Lingampally',
    pincode: '500019',
    dispatchTime: '20 - 35 mins',
    description: 'Our core operating hub with immediate clinical dispatch for injections, catheter care, and elderly assistance.',
    popularServices: ['IM/IV Injections', 'Urinary Catheter Care', '24/7 Elderly Care'],
  },
  {
    slug: 'gachibowli',
    name: 'Gachibowli',
    pincode: '500032',
    dispatchTime: '25 - 40 mins',
    description: 'Serving IT corridor families and high-rise apartments with verified bedside attendants and post-op wound care.',
    popularServices: ['Post-Op Dressing', 'IV Infusion Therapy', 'At-Home IVF Support'],
  },
  {
    slug: 'kondapur',
    name: 'Kondapur',
    pincode: '500084',
    dispatchTime: '25 - 40 mins',
    description: 'Full coverage near KIMS and Apollo clinics with dedicated day and night shift home nurses.',
    popularServices: ['Bedridden Patient Care', 'IM/IV Injections', 'Physiotherapy'],
  },
  {
    slug: 'miyapur',
    name: 'Miyapur',
    pincode: '500049',
    dispatchTime: '30 - 45 mins',
    description: 'Experienced senior citizen caretakers and post-surgical rehabilitation support across Miyapur colonies.',
    popularServices: ['Senior Citizen Assistance', 'Wound Dressing', 'Stroke Rehabilitation'],
  },
  {
    slug: 'chandanagar',
    name: 'Chandanagar',
    pincode: '500050',
    dispatchTime: '25 - 35 mins',
    description: 'Rapid doorstep nursing visits for scheduled daily insulin and hormone injections and regular vital checks.',
    popularServices: ['Scheduled Injections', 'Catheter Replacement', 'Vitals Oversight'],
  },
  {
    slug: 'madhapur',
    name: 'Madhapur / Hitec City',
    pincode: '500081',
    dispatchTime: '35 - 50 mins',
    description: 'Flexible hourly, 12-hour, and 24-hour nursing support for working families and convalescent care.',
    popularServices: ['24/7 Dedicated Care', 'IV Hydration Therapy', 'Elder Care'],
  },
  {
    slug: 'financial-district',
    name: 'Financial District / Nanakramguda',
    pincode: '500075',
    dispatchTime: '30 - 45 mins',
    description: 'Verified professional nurses for gated communities and luxury residential societies with priority scheduling.',
    popularServices: ['Critical Care at Home', 'IVF Hormone Support', 'Day/Night Attendants'],
  },
  {
    slug: 'bhel',
    name: 'BHEL & RC Puram',
    pincode: '502032',
    dispatchTime: '25 - 40 mins',
    description: 'Long-standing home healthcare support for retired personnel, senior couples, and chronic care management.',
    popularServices: ['Chronic Illness Care', 'Bedside Attendant', 'Wound Management'],
  },
];

export default function AreasServedSection() {
  return (
    <section className="py-16 lg:py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Active Dispatch Localities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Rapid Nurse Arrival Across West Hyderabad
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Local nursing teams stationed across key neighborhoods ensure quick arrival times and continuous coverage.
            </p>
          </div>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-xs uppercase tracking-wider group"
          >
            <span>Book In Your Locality</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Localities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HYDERABAD_LOCALITIES.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-primary-400/80 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 font-bold">PIN {loc.pincode}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {loc.dispatchTime}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors flex items-center gap-1.5">
                    <span>{loc.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {loc.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                {loc.popularServices.map((srv, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Assurance Banner */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold block">Need care outside these listed neighborhoods?</strong>
              <span className="text-slate-500 text-[11px]">We serve extended areas across Hyderabad with pre-scheduled appointments.</span>
            </div>
          </div>
          <Link
            href="/booking"
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            Check Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
