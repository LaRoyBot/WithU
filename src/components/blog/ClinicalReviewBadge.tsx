import React from 'react';
import Image from 'next/image';
import { ClinicalReviewer } from '@/types/blog';
import { ShieldCheck, Award } from 'lucide-react';

interface ClinicalReviewBadgeProps {
  reviewer: ClinicalReviewer;
  lastReviewedDate?: string;
}

export default function ClinicalReviewBadge({ reviewer, lastReviewedDate }: ClinicalReviewBadgeProps) {
  return (
    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/50 shadow-sm">
        <Image
          src="/images/original/sunitha.jpg"
          alt={reviewer.name}
          fill
          className="object-cover object-top"
        />
      </div>
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medically Reviewed by</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verified Nurse</span>
          </span>
        </div>
        <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
          {reviewer.name}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {reviewer.credentials} • Registered with {reviewer.registrationCouncil}.
        </p>
        {lastReviewedDate && (
          <div className="text-[10px] text-slate-500 pt-0.5">
            Protocol verified current as of {new Date(lastReviewedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
}
