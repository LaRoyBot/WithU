'use client';

import React from 'react';
import Image from 'next/image';

const SLIDES = [
  { src: '/images/original/hero-1.jpg', alt: 'Certified Home Nursing Care' },
  { src: '/images/original/hero-2.jpg', alt: 'Elderly & Bedridden Patient Care' },
  { src: '/images/original/hero-3.jpg', alt: 'Post-Surgical Dressing & Recovery' },
  { src: '/images/original/hero-4.jpg', alt: '24/7 Dedicated Caregiver Assistance' },
];

interface HeroBackgroundSliderProps {
  children: React.ReactNode;
}

export default function HeroBackgroundSlider({ children }: HeroBackgroundSliderProps) {
  // Seamless loop by repeating slides array once (2 identical sets)
  const duplicatedSlides = [...SLIDES, ...SLIDES];

  return (
    <section className="relative overflow-hidden w-full bg-slate-950 border-b border-slate-800 min-h-[640px] lg:min-h-[700px] flex items-center">
      <style jsx global>{`
        @keyframes heroSlowSlide {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-hero-slide {
          display: flex;
          width: 600%;
          animation: heroSlowSlide 165s linear infinite;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .animate-hero-slide {
            animation-duration: 120s;
          }
        }
      `}</style>

      {/* 1. Very Slow Continuous Sliding Background Track */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <div className="animate-hero-slide h-full">
          {duplicatedSlides.map((slide, idx) => (
            <div key={idx} className="relative w-[12.5%] h-full shrink-0 min-h-[640px] lg:min-h-[700px]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx < 2}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* 2. Soft Balanced Overlay for High Legibility without dimming images */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/80 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* 3. Foreground Content: Value Prop on Left + Floating Booking Box on Right */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
