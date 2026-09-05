import React from 'react';
import Link from 'next/link';
import { HelpCircle, Stethoscope, ArrowRight, PhoneCall, ShieldCheck, MapPin } from 'lucide-react';

interface InArticleBookingCardProps {
  primaryServiceSlug: string;
  articleTitle: string;
}

const SERVICE_LOOKUP: Record<string, { name: string; description: string; topicAdvice: string }> = {
  'post-surgical-care': {
    name: 'Post-Surgical Nursing Support',
    description: 'Sterile surgical dressing changes, vitals tracking, and drain supervision.',
    topicAdvice: 'If you observe persistent drainage, high fever, or need sterile incision dressings after discharge, professional bedside assistance helps avoid hospital readmission.'
  },
  'wound-surgical-dressing': {
    name: 'Sterile Wound & Diabetic Ulcer Dressing',
    description: 'Aseptic debridement assessment, multi-layer dressing, and healing monitoring.',
    topicAdvice: 'Diabetic foot ulcers and non-healing wounds require strict aseptic technique to prevent deep tissue infection and osteomyelitis.'
  },
  'urinary-catheter-change': {
    name: 'Catheter Insertion, Flushing & Replacement',
    description: 'Hygienic Foley catheterization, urobag maintenance, and blockage management.',
    topicAdvice: 'Catheter blockages, severe spasms, or cloudy urine with fever require prompt clinical evaluation to prevent CAUTI and kidney complications.'
  },
  'dedicated-24-7-nursing': {
    name: '24/7 Dedicated Bedside Nursing Care',
    description: 'Round-the-clock intensive elderly assistance, bedridden patient turning, and vitals monitoring.',
    topicAdvice: 'For bedridden elders recovering from stroke or acute hospitalizations, continuous bedside care prevents bedsores, falls, and aspiration pneumonia.'
  },
  'at-home-ivf-support': {
    name: 'At-Home IVF Hormone Injections',
    description: 'Scheduled subcutaneous and deep intramuscular hormone administration.',
    topicAdvice: 'Strict timing protocols for stimulation hormones and hCG triggers are vital for IVF cycle success. Timely home nurse visits ensure stress-free administration.'
  },
  'iv-infusion-hydration': {
    name: 'IV Saline, Hydration & Antibiotic Infusion',
    description: 'Doctor-prescribed intravenous cannulation, flow-rate monitoring, and phlebitis checks.',
    topicAdvice: 'Never administer IV infusions without a doctor prescription. Certified nurses ensure correct vein selection, drip rate calibration, and immediate complication checks.'
  },
  'physiotherapy-rehab': {
    name: 'Home Physiotherapy & Stroke Rehabilitation',
    description: 'Bedside mobility restoration, passive range-of-motion, and contracture prevention.',
    topicAdvice: 'The first 90 days following a stroke represent the golden window for neuroplastic recovery. Early physical therapy helps restore independence.'
  }
};

export default function InArticleBookingCard({ primaryServiceSlug, articleTitle }: InArticleBookingCardProps) {
  const service = SERVICE_LOOKUP[primaryServiceSlug] || SERVICE_LOOKUP['post-surgical-care'];

  return (
    <div className="my-10 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
      <div className="space-y-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-primary-300 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-primary-400" />
            <span>Need Clinical Guidance or Local Nurse Support?</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Serving Hyderabad & Telangana</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Connecting Medical Information to Real Patient Care
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {service.topicAdvice}
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-white block">
              Have clinical questions or need a verified nurse in Hyderabad?
            </span>
            <p className="text-slate-400">
              Neetha Nursing Service coordinates certified GNM/B.Sc nurses for home visits, doctor-directed procedures, and family bedside guidance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <span>Visit neethanursing.in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="tel:+918341069693"
              className="inline-flex items-center gap-1.5 border border-slate-600 hover:border-slate-500 text-slate-200 hover:text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Talk to Coordinator</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
