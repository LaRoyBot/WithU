import React from 'react';
import Link from 'next/link';
import { Calendar, MessageSquare, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface InArticleBookingCardProps {
  primaryServiceSlug: string;
  articleTitle: string;
}

const SERVICE_LOOKUP: Record<string, { name: string; price: number; unit: string; description: string }> = {
  'post-surgical-care': {
    name: 'Post-Surgical Nursing Care',
    price: 1500,
    unit: 'day',
    description: 'Vitals tracking, surgical drain maintenance, and recovery oversight at home.'
  },
  'wound-surgical-dressing': {
    name: 'Sterile Wound & Surgical Dressing',
    price: 450,
    unit: 'visit',
    description: 'Aseptic dressing changes for surgical cuts, diabetic ulcers, and wounds.'
  },
  'urinary-catheter-change': {
    name: 'Urinary Catheter Insertion & Change',
    price: 600,
    unit: 'visit',
    description: 'Sterile Foley catheterization and urobag flushing by trained nurses.'
  },
  'dedicated-24-7-nursing': {
    name: '24/7 Dedicated Bedside Nursing',
    price: 2500,
    unit: 'day',
    description: 'Round-the-clock intensive bedside care for elderly and critical patients.'
  },
  'at-home-ivf-support': {
    name: 'At-Home IVF Hormone Injections',
    price: 400,
    unit: 'visit',
    description: 'On-time subcutaneous and intramuscular progesterone/hCG injections.'
  },
  'iv-infusion-hydration': {
    name: 'IV Fluid Infusion & Saline Therapy',
    price: 500,
    unit: 'visit',
    description: 'Safe intravenous cannulation, antibiotic infusion, and saline setup.'
  },
  'physiotherapy-rehab': {
    name: 'Home Physiotherapy & Stroke Rehab',
    price: 800,
    unit: 'visit',
    description: 'Passive range-of-motion, mobility restoration, and stroke therapy.'
  }
};

export default function InArticleBookingCard({ primaryServiceSlug, articleTitle }: InArticleBookingCardProps) {
  const service = SERVICE_LOOKUP[primaryServiceSlug] || SERVICE_LOOKUP['post-surgical-care'];

  const whatsappMessage = encodeURIComponent(
    `Hello Neetha Nursing Service, I was reading your guide on "${articleTitle}" and need a verified nurse for ${service.name} in Hyderabad.`
  );

  return (
    <div className="my-10 bg-gradient-to-br from-primary-950 via-slate-900 to-primary-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-primary-800/80 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-primary-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-primary-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Need Clinical Assistance at Home?</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-primary-300" />
            <span>30-45 Min Dispatch in Hyderabad</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
              Book a Certified Nurse for {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {service.description} Hospital-trained GNM/B.Sc nurses available across Lingampally, Gachibowli, Kondapur, and Miyapur.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Advance Deposit</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aseptic Sterile Kits</span>
              </span>
            </div>
          </div>

          <div className="sm:col-span-4 bg-white/10 p-4 rounded-2xl border border-white/15 text-center space-y-2 backdrop-blur-md">
            <div className="text-[11px] text-primary-200 uppercase tracking-wider font-bold">Standard Rate</div>
            <div className="text-3xl font-black font-mono text-white tracking-tight">
              ₹{service.price}
              <span className="text-xs font-sans text-slate-300 font-normal">/{service.unit}</span>
            </div>
            <div className="text-[10px] text-slate-300">Inclusive of nurse home visit</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/booking"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-all group"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Home Visit Online</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={`https://wa.me/918341069693?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Nurse on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
