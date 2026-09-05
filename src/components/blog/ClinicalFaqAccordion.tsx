'use client';

import React, { useState } from 'react';
import { ClinicalQuestionAnswer } from '@/types/blog';
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface ClinicalFaqSectionProps {
  criticalQuestions: ClinicalQuestionAnswer[];
  practicalQuestions: ClinicalQuestionAnswer[];
  curiousQuestions: ClinicalQuestionAnswer[];
}

export default function ClinicalFaqSection({
  criticalQuestions,
  practicalQuestions,
  curiousQuestions
}: ClinicalFaqSectionProps) {
  // Set default open item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [criticalQuestions[0]?.id || '']: true
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderQuestionGroup = (
    title: string,
    subtitle: string,
    badgeText: string,
    badgeColor: string,
    icon: React.ReactNode,
    questions: ClinicalQuestionAnswer[],
    theme: 'rose' | 'amber' | 'sky'
  ) => {
    if (!questions || questions.length === 0) return null;

    const themeStyles = {
      rose: {
        border: 'border-rose-200',
        bg: 'bg-rose-50/50',
        headerBg: 'bg-rose-50',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        accentText: 'text-rose-900',
        cardBorder: 'border-rose-100',
        referralBg: 'bg-rose-50/70 border-rose-200'
      },
      amber: {
        border: 'border-amber-200',
        bg: 'bg-amber-50/40',
        headerBg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        accentText: 'text-amber-900',
        cardBorder: 'border-amber-100',
        referralBg: 'bg-amber-50/70 border-amber-200'
      },
      sky: {
        border: 'border-sky-200',
        bg: 'bg-sky-50/40',
        headerBg: 'bg-sky-50',
        badge: 'bg-sky-100 text-sky-800 border-sky-200',
        accentText: 'text-sky-900',
        cardBorder: 'border-sky-100',
        referralBg: 'bg-sky-50/70 border-sky-200'
      }
    }[theme];

    return (
      <div className={`rounded-2xl border ${themeStyles.border} overflow-hidden shadow-sm space-y-3 p-5 sm:p-6 ${themeStyles.bg}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2.5">
            {icon}
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${themeStyles.badge}`}>
            {badgeText}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {questions.map((q) => {
            const isOpen = !!openItems[q.id];

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(q.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-xs font-extrabold text-primary-600 block uppercase tracking-wider">
                      Question & Clinical Insight
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                    {!isOpen && (
                      <p className="text-xs text-slate-500 line-clamp-1 pt-0.5">
                        {q.shortAnswer}
                      </p>
                    )}
                  </div>
                  <div className={`p-1 rounded-lg bg-slate-100 text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-primary-50 text-primary-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed animate-in fade-in duration-200">
                    {/* Quick Direct Answer Summary */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-medium text-slate-800">
                      <strong className="text-primary-800 block text-xs uppercase font-extrabold tracking-wider mb-1">
                        Direct Medical Answer:
                      </strong>
                      {q.shortAnswer}
                    </div>

                    {/* Detailed Multi-Paragraph Explanation */}
                    <div className="space-y-2.5 text-slate-700">
                      {q.detailedAnswer.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Clinical Significance / Biological Reason (if available) */}
                    {q.clinicalSignificance && (
                      <div className="bg-primary-50/70 border-l-4 border-primary-600 p-3 rounded-r-xl space-y-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wide text-primary-800 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-primary-600" />
                          <span>Why This Happens (Clinical Mechanism):</span>
                        </span>
                        <p className="text-xs text-slate-700">
                          {q.clinicalSignificance}
                        </p>
                      </div>
                    )}

                    {/* Warning Symptoms to Look For */}
                    {q.whatToLookFor && q.whatToLookFor.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-bold text-slate-900 block">
                          Key Signs & Specific Indicators to Monitor:
                        </span>
                        <ul className="space-y-1 pl-1">
                          {q.whatToLookFor.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practical Steps Caregiver Can Follow */}
                    {q.practicalProtocol && q.practicalProtocol.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs font-bold text-slate-900 block">
                          Recommended Protocol:
                        </span>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {q.practicalProtocol.map((step, idx) => (
                            <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                              <span className="font-bold text-slate-900 mr-1.5">{idx + 1}.</span>
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Objective When to Seek Help & Referral */}
                    <div className={`p-3 rounded-xl border ${themeStyles.referralBg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs`}>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          When to Contact Healthcare Professionals:
                        </span>
                        <p className="text-slate-600">
                          {q.whenToContactProfessional}
                        </p>
                      </div>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1 text-primary-700 hover:text-primary-800 font-bold underline shrink-0"
                      >
                        <span>Learn more on neethanursing.in</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 my-10" id="clinical-questions">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-primary-100 text-primary-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-primary-600" />
            <span>Frequently Asked Clinical Questions</span>
          </span>
          <span className="text-xs text-slate-500">• Reviewed by Registered Nurses</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
          Essential Answers for Patients & Family Caregivers
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Whether you are facing an urgent warning sign, wondering how to handle daily bedside routines, or curious about the biological reasons behind medical instructions, find clear, objective explanations below.
        </p>
      </div>

      {/* 1. Critical Questions (Urgent / Safety Warning) */}
      {renderQuestionGroup(
        'Critical Clinical Questions (Urgent Patient Safety)',
        'Crucial indicators requiring prompt medical evaluation or immediate attention.',
        'Urgent / Red Flags',
        'bg-rose-100 text-rose-800 border-rose-200',
        <AlertTriangle className="w-5 h-5 text-rose-600" />,
        criticalQuestions,
        'rose'
      )}

      {/* 2. Practical Day-to-Day Questions */}
      {renderQuestionGroup(
        'Practical Home Management & Protocol Questions',
        'Daily hygiene, dressing changes, posture, and recovery routines at home.',
        'Practical Guidance',
        'bg-amber-100 text-amber-800 border-amber-200',
        <Stethoscope className="w-5 h-5 text-amber-600" />,
        practicalQuestions,
        'amber'
      )}

      {/* 3. Curious & General Healthcare Literacy Questions */}
      {renderQuestionGroup(
        'Curious & General Healthcare Inquiries',
        'Understanding how procedures work and common medical misconceptions explained.',
        'Good to Know',
        'bg-sky-100 text-sky-800 border-sky-200',
        <Sparkles className="w-5 h-5 text-sky-600" />,
        curiousQuestions,
        'sky'
      )}
    </div>
  );
}
