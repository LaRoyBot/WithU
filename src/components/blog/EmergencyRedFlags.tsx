import React from 'react';
import { EmergencyRedFlag } from '@/types/blog';
import { AlertTriangle, AlertCircle, ShieldAlert, PhoneCall } from 'lucide-react';

interface EmergencyRedFlagsProps {
  flags: EmergencyRedFlag[];
}

export default function EmergencyRedFlags({ flags }: EmergencyRedFlagsProps) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="bg-rose-50/90 border-2 border-rose-300/80 rounded-2xl p-5 sm:p-6 space-y-4 my-8 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-rose-800">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <h3 className="text-base font-extrabold tracking-tight">Clinical Emergency Red Flags</h3>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200/80 text-rose-900 px-2.5 py-1 rounded-full">
          Do Not Delay Medical Attention
        </span>
      </div>

      <p className="text-xs text-rose-900 leading-relaxed font-medium">
        If the patient experiences any of the following clinical warning signs, immediate medical action is mandatory. Do not wait for routine home visits.
      </p>

      <div className="space-y-3">
        {flags.map((flag, idx) => {
          const isEmergency = flag.urgency === 'IMMEDIATE_EMERGENCY';
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                isEmergency
                  ? 'bg-white border-rose-400 shadow-sm'
                  : 'bg-white/80 border-rose-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isEmergency ? 'text-rose-600 font-bold animate-pulse' : 'text-amber-600'
                  }`}
                />
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-slate-900">
                    {flag.sign}
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <strong className="text-rose-700">Required Action:</strong> {flag.actionRequired}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-rose-100/60 p-3 rounded-xl">
        <span className="text-rose-900 font-bold flex items-center gap-1.5">
          <span>Need immediate advice from a Hyderabad nurse coordinator?</span>
        </span>
        <a
          href="tel:+918341069693"
          className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 8341069693 Now</span>
        </a>
      </div>
    </div>
  );
}
