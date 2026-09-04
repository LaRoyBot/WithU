'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
  {
    src: '/images/original/hero-1.jpg',
    alt: 'Certified Home Nursing Care',
    caption: 'Certified GNM / B.Sc. Nurses at Home',
  },
  {
    src: '/images/original/hero-2.jpg',
    alt: 'Elderly & Bedridden Patient Care',
    caption: 'Elderly & Compassionate Bedside Care',
  },
  {
    src: '/images/original/hero-3.jpg',
    alt: 'Post-Surgical Dressing & Recovery',
    caption: 'Sterile Wound & Post-Op Recovery',
  },
  {
    src: '/images/original/hero-4.jpg',
    alt: '24/7 Dedicated Caregiver Assistance',
    caption: '24/7 Dedicated Shift Nursing',
  },
];

interface HeroBackgroundSliderProps {
  children: React.ReactNode;
}

export default function HeroBackgroundSlider({ children }: HeroBackgroundSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance slide every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden w-full bg-slate-900 border-b border-slate-800 min-h-[640px] lg:min-h-[700px] flex items-center">
      {/* 1. Clear, Visible Sliding Track */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        {/* Horizontal sliding track that shifts across slides */}
        <div
          className="flex h-full w-[400%] transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 25}%)` }}
        >
          {SLIDES.map((slide, idx) => (
            <div key={idx} className="relative w-1/4 h-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* 2. Balanced Overlay: keeps images bright & visible, while ensuring white text pops */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/75 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* 3. Foreground Content: Headline + Quick Booking Card */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        {children}

        {/* Carousel Controls: Navigation Arrows & Indicator Dots */}
        <div className="mt-8 flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 bg-emerald-400 shadow-md'
                    : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-sm font-bold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              aria-label="Previous Slide"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % SLIDES.length)}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-sm font-bold backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              aria-label="Next Slide"
            >
              ›
            </button>
            <span className="text-xs text-white/90 font-semibold drop-shadow ml-2 hidden md:inline-block bg-black/40 px-3 py-1 rounded-full border border-white/10">
              {SLIDES[activeIndex].caption}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
