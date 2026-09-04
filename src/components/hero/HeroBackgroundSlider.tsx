'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HERO_SLIDES = [
  {
    src: '/images/original/hero-1.jpg',
    alt: 'Verified Clinical Nursing at Home',
    badge: 'Certified Home Nursing',
  },
  {
    src: '/images/original/hero-2.jpg',
    alt: 'Compassionate Elderly & Senior Citizen Care',
    badge: 'Elderly & Bedside Care',
  },
  {
    src: '/images/original/hero-3.jpg',
    alt: 'Confidential & Safe Patient Care at Doorstep',
    badge: 'Post-Surgical Recovery',
  },
  {
    src: '/images/original/hero-4.jpg',
    alt: '24/7 Dedicated Caregiver Coordination',
    badge: '24/7 Dedicated Attendants',
  },
];

interface HeroBackgroundSliderProps {
  children: React.ReactNode;
}

export default function HeroBackgroundSlider({ children }: HeroBackgroundSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // Transitions every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden w-full bg-slate-950 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* 1. Background Images with Smooth Cross-Fade & Subtle Ken Burns Zoom */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={`object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* 2. Premium Multi-Layer Contrast Gradients for Guaranteed Legibility */}
        {/* Dark Slate Base Vignette */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-brightness-75" />

        {/* Left-to-Right Horizon Gradient (Deep dark on text, softer over center, darker behind form) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/90" />

        {/* Vertical Fade at top and bottom edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />

        {/* Subtle Brand Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      {/* 3. Foreground Content (Children: Headline on Left + Floating Glass Card on Right) */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {children}

        {/* Slide Indicator Dots */}
        <div className="mt-8 flex items-center justify-center sm:justify-start gap-2">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? 'w-7 bg-primary-400'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${index + 1}: ${slide.badge}`}
              title={slide.badge}
            />
          ))}
          <span className="text-[10px] text-slate-400 font-mono ml-2 hidden sm:inline-block">
            {HERO_SLIDES[currentSlide].badge}
          </span>
        </div>
      </div>
    </div>
  );
}
