'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, Lock, ArrowLeft, PhoneCall } from 'lucide-react';

export default function AccessDenied403View() {
  const footerRef = useRef<HTMLElement>(null);
  const [footerParallaxY, setFooterParallaxY] = useState(-40);
  const [footerShadowOpacity, setFooterShadowOpacity] = useState(0.6);

  useEffect(() => {
    // Parallax ScrollTrigger mechanics
    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const currentDistance = windowHeight - rect.top;
        const progress = Math.min(1, Math.max(0, currentDistance / windowHeight));

        // Parallax move: -40% to 0%
        const yPercent = -40 + progress * 40;
        setFooterParallaxY(yPercent);

        // Shadow gradient: 0.6 to 0.0
        const opacity = 0.6 * (1 - progress);
        setFooterShadowOpacity(opacity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const marqueeItems = [
    'Protected record',
    'Access restricted',
    '403',
    'DPDP Act 2023',
    'Encrypted at rest',
    'Authorized only',
    'Identity required',
  ];

  return (
    <div className="relative w-full bg-[#5500a3] text-white cursor-default font-sans selection:bg-[#1e003a] selection:text-white">
      <style jsx global>{`
        @font-face {
          font-family: 'NeueMontreal';
          src: url('/neue-montreal.woff2') format('woff2');
          font-weight: 450 700;
          font-display: swap;
        }

        :root {
          --color-brand-primary: #5500a3;
          --color-brand-vivid: #6800c4;
          --color-brand-light: #d8c0ff;
          --color-brand-dark: #1e003a;
          --color-brand-btn: #ffffff;
        }

        body {
          font-family: 'NeueMontreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: var(--color-brand-primary);
          color: #ffffff;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        /* Stately Cinematic Slow Marquee (140s) */
        @keyframes infiniteScrollX {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .infinite-x-track {
          display: flex;
          width: max-content;
          animation: infiniteScrollX 140s linear infinite;
          will-change: transform;
        }

        .infinite-x-track:hover {
          animation-play-state: paused;
        }

        .infinite-item-dot {
          display: flex;
          align-items: center;
          gap: 0.4em;
          padding-left: 0.4em;
          white-space: nowrap;
        }

        .infinite-item-dot::after {
          content: '';
          display: inline-block;
          width: 0.12em;
          height: 0.12em;
          border-radius: 9999px;
          background-color: var(--color-brand-light);
          margin-left: 0.4em;
          opacity: 0.7;
        }

        /* Pill button with hover scale and sliding arrow */
        .ng-btn {
          display: inline-flex;
          align-items: center;
          background-color: #ffffff;
          color: var(--color-brand-primary);
          padding: 1.3em 2.3em;
          border-radius: 9999px;
          font-size: max(0.936vw, 0.777rem);
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          line-height: 1;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .ng-btn:hover {
          background-color: #ebdfff;
          color: var(--color-brand-dark);
        }

        .ng-btn-icon {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 0;
          margin-left: 0;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.35s cubic-bezier(0.45, 0.05, 0.07, 1);
        }

        .ng-btn:hover .ng-btn-icon {
          width: 1.6em;
          margin-left: 0.8em;
          opacity: 1;
          transform: translateX(0);
        }

        .ng-table-link {
          position: relative;
          display: inline-block;
        }
        .ng-table-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        .ng-table-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 sm:px-12 lg:px-16 py-7 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto text-white hover:opacity-90 transition-opacity flex items-center gap-3"
          aria-label="Neetha Nursing Service"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
            <Image
              src="/images/original/logo.jpg"
              alt="Neetha Nursing Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight leading-none text-white">
              Neetha Nursing
            </span>
            <span className="text-[10px] font-bold text-primary-200 uppercase tracking-widest leading-tight mt-0.5">
              DPDP Act 2023 Compliant
            </span>
          </div>
        </Link>

        {/* Security Capsule */}
        <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[11px] font-mono tracking-wider text-primary-200">
          <Lock className="w-3.5 h-3.5 text-primary-300" />
          <span>AES-256 RESTRICTED</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: 403 RESTRICTED PRIVACY GATE                                    */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen z-20 flex flex-col justify-between pt-28 pb-12 sm:pb-16 bg-[#5500a3] text-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
        {/* Center Giant Kinetic Marquee */}
        <div className="my-auto w-full overflow-hidden select-none py-10">
          <div className="infinite-x-track flex items-center">
            {/* Strip 1 */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((text, i) => (
                <div
                  key={`m1-${i}`}
                  className="infinite-item-dot text-[clamp(4.2rem,18vw,15.5rem)] font-[575] leading-[0.88] tracking-[-0.04em]"
                  style={{
                    color: text === '403' ? '#d8c0ff' : '#ffffff',
                  }}
                >
                  {text}
                </div>
              ))}
            </div>

            {/* Strip 2 for seamless loop */}
            <div className="flex items-center shrink-0">
              {marqueeItems.map((text, i) => (
                <div
                  key={`m2-${i}`}
                  className="infinite-item-dot text-[clamp(4.2rem,18vw,15.5rem)] font-[575] leading-[0.88] tracking-[-0.04em]"
                  style={{
                    color: text === '403' ? '#d8c0ff' : '#ffffff',
                  }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Content Grid */}
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-12 gap-y-6 items-end">
            {/* Left Button */}
            <div className="col-span-12 sm:col-span-7 md:col-span-8">
              <Link href="/customer/login" className="ng-btn">
                <span>Authenticate Patient Login</span>
                <span className="ng-btn-icon">
                  <svg viewBox="0 0 73 44" fill="currentColor" className="w-5 h-3">
                    <path d="m53 43-4.4-4.2 12.9-13.8h-61v-6.1h61l-12.9-13.8 4.4-4.1 19.5 21z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Right Side Editorial Callout */}
            <div className="col-span-12 sm:col-span-5 md:col-span-4 text-left sm:text-right">
              <p className="text-xs sm:text-sm font-[575] uppercase tracking-wider leading-snug max-w-xs sm:ml-auto text-primary-200">
                Patient health information and clinical logs require verified access.
              </p>
            </div>
          </div>

          {/* Scroll Down Hint with Animated Arrow */}
          <div className="pt-10 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-primary-200/80">
            <span>Scroll for compliance notice</span>
            <span className="animate-bounce font-bold">↓</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PARALLAX CURTAIN COMPLIANCE FOOTER (SCROLL DOWN)               */}
      {/* ========================================================================= */}
      <footer
        ref={footerRef}
        id="footer"
        className="relative min-h-screen z-10 bg-[#440082] text-white px-6 sm:px-12 lg:px-16 pt-24 pb-14 flex flex-col justify-between overflow-hidden"
      >
        {/* Dynamic Black Top Gradient Shadow */}
        <div
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent pointer-events-none z-30 transition-opacity duration-75"
          style={{ opacity: footerShadowOpacity }}
        />

        {/* Content Container that slides in via Parallax */}
        <div
          className="max-w-7xl w-full mx-auto my-auto flex flex-col justify-between grow transition-transform duration-75 ease-out"
          style={{ transform: `translate3d(0, ${footerParallaxY}px, 0)` }}
        >
          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16 pt-10">
            {/* Left Column: Heading & Return Action */}
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-between space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[575] tracking-tight leading-[1.12]">
                  Patient data protection is strictly enforced.
                </h2>
                <p className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-primary-200">
                  DPDP Act 2023 & Clinical Confidentiality Protocol.
                </p>
              </div>

              <div>
                <Link href="/" className="ng-btn">
                  <span>Return to Homepage</span>
                  <span className="ng-btn-icon">
                    <svg viewBox="0 0 73 44" fill="currentColor" className="w-5 h-3">
                      <path d="m53 43-4.4-4.2 12.9-13.8h-61v-6.1h61l-12.9-13.8 4.4-4.1 19.5 21z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Column: Statutory Safeguards Table */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-center space-y-8">
              {/* Privacy Safeguards */}
              <div className="border-t border-primary-700/60 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-xs uppercase tracking-wider font-bold text-primary-200">
                  Data Policy:
                </div>
                <div className="sm:col-span-2 space-y-4 text-xs uppercase tracking-wider font-semibold">
                  <div className="flex items-center justify-between pb-2 border-b border-primary-700/40">
                    <span>Patient Contact Numbers</span>
                    <span className="text-primary-100">Hidden from field nurses</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-primary-700/40">
                    <span>Clinical Records</span>
                    <span className="text-primary-100">Cryptographically encrypted at rest</span>
                  </div>
                </div>
              </div>

              {/* Identity Verification */}
              <div className="border-t border-primary-700/60 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-xs uppercase tracking-wider font-bold text-primary-200">
                  Personnel:
                </div>
                <div className="sm:col-span-2 space-y-4 text-xs uppercase tracking-wider font-semibold">
                  <div className="flex items-center justify-between pb-2 border-b border-primary-700/40">
                    <span>Clinical Staff</span>
                    <span className="text-primary-100">GNM / B.Sc. Verified Caregivers</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-primary-700/40">
                    <span>Data Protection Officer</span>
                    <a href="tel:+918341069693" className="ng-table-link text-primary-200">
                      Contact Clinical Director
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Strip */}
          <div className="w-full pt-16 border-t border-primary-700/60 mt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-xs uppercase tracking-wider font-bold text-primary-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary-300" />
              <span>Digital Personal Data Protection (DPDP) Act 2023 Mandate</span>
            </div>
            <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
              <Link href="/customer/login" className="hover:underline">Patient Login</Link>
              <Link href="/employee/login" className="hover:underline">Staff Portal</Link>
              <Link href="/contact" className="hover:underline">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
