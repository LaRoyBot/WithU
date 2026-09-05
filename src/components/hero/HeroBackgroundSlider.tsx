'use client';

import React from 'react';
import Image from 'next/image';

interface HeroBackgroundSliderProps {
  children: React.ReactNode;
}

export default function HeroBackgroundSlider({ children }: HeroBackgroundSliderProps) {
  return (
    <section className="relative overflow-hidden w-full bg-slate-950 border-b border-slate-800 min-h-[640px] lg:min-h-[700px] flex items-center">
      <style jsx global>{`
        @keyframes heroSlowSlide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-hero-slide {
          display: flex;
          height: 100%;
          width: max-content;
          animation: heroSlowSlide 90s linear infinite;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .animate-hero-slide {
            animation-duration: 65s;
          }
        }
      `}</style>

      {/* 1. Very Slow Continuous Sliding Background Track with Seamless Blended Panorama */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <div className="animate-hero-slide h-full">
          {/* First Panorama Strip */}
          <div className="relative h-full min-h-[640px] lg:min-h-[700px] shrink-0">
            <Image
              src="/images/original/hero-panorama-seamless.jpg"
              alt="Certified Home Nursing & Clinical Care in Hyderabad"
              width={2123}
              height={700}
              priority
              className="h-full min-h-[640px] lg:min-h-[700px] w-auto object-cover object-center select-none"
            />
          </div>

          {/* Second Duplicate Strip for Flawless Seamless Infinite Stitching */}
          <div className="relative h-full min-h-[640px] lg:min-h-[700px] shrink-0">
            <Image
              src="/images/original/hero-panorama-seamless.jpg"
              alt="Certified Home Nursing & Clinical Care in Hyderabad"
              width={2123}
              height={700}
              className="h-full min-h-[640px] lg:min-h-[700px] w-auto object-cover object-center select-none"
            />
          </div>
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
