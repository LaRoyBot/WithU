'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How quickly can a certified nurse reach our home in Hyderabad?',
    answer:
      'For high-density neighborhoods including Lingampally, Gachibowli, Kondapur, Miyapur, and Madhapur, our on-duty nurses arrive within 30 to 60 minutes for urgent injections, wound dressings, or catheter replacements. For planned 12-hour or 24/7 bedside nursing shifts, caregivers can be deployed on the same day or scheduled in advance.',
  },
  {
    question: 'Are all Neetha Nursing Service caregivers background-verified and certified?',
    answer:
      'Yes, 100% of our clinical staff and bedside attendants undergo thorough verification. We verify government identity documents (Aadhaar, PAN), check clinical education certificates (GNM, B.Sc. Nursing, or ANM), and maintain zero-tolerance criminal screening before active deployment.',
  },
  {
    question: 'What home healthcare services do you provide?',
    answer:
      'We provide a comprehensive range of clinical services at home: intramuscular and intravenous (IM/IV) injections, sterile surgical wound and bed sore dressings, urinary catheter insertion and care, IV fluid infusion and hydration therapy, scheduled IVF cycle injections, post-operative surgical recovery, continuous 12hr/24hr elderly care, and bedside mobility assistance.',
  },
  {
    question: 'Can I pay after the nursing visit is completed?',
    answer:
      'Yes, we provide flexible payment choices. You can pay securely online via UPI with an instant booking discount, or choose Doorstep Payment to pay cash or UPI directly to the nurse upon arrival at your residence.',
  },
  {
    question: 'How do you coordinate long-term 24/7 bedside nursing care?',
    answer:
      'For continuous 24/7 care, we assign dedicated primary and rotation caregivers to ensure uninterrupted coverage with rested staff. A dedicated care coordinator monitors vitals logs, medication compliance, and patient comfort daily.',
  },
  {
    question: 'Are clinical consumables (syringes, spirit, gloves) provided by the nurse?',
    answer:
      'Our nurses arrive with professional diagnostic kits (digital BP monitors, pulse oximeters, thermometers) and basic consumables for injections or dressing visits. Prescribed pharmaceuticals, specialized surgical dressings, and IV fluids should be kept ready based on your physician’s prescription.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 lg:py-20 px-6 bg-slate-50 border-t border-slate-200/80">
      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-primary-600" />
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to know about home healthcare
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Clear answers about caregiver qualifications, emergency dispatch response times, and booking in Hyderabad.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-primary-50 text-primary-600 rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="bg-primary-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Have a specific medical question or need urgent assistance?</h3>
            <p className="text-xs text-primary-200">
              Our clinical care supervisors are available 24/7 to guide you on appropriate caregiver selection.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="tel:+918341069693"
              className="inline-flex items-center gap-2 bg-white text-primary-900 hover:bg-primary-50 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              <PhoneCall className="w-3.5 h-3.5 text-primary-600" />
              <span>Call 8341069693</span>
            </a>
            <Link
              href="/booking"
              className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Book Online
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
