'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, PhoneCall, Stethoscope, ArrowRight } from 'lucide-react';

export default function ErrorFace404() {
  return (
    <div className="relative min-h-screen w-full bg-[#fcfcfc] text-slate-900 flex flex-col items-center justify-between p-6 sm:p-10 select-none font-sans">
      <style jsx global>{`
        .face {
          display: block;
          width: 13.5em;
          max-width: 100%;
          height: auto;
        }

        .face__eyes,
        .face__eye-lid,
        .face__mouth-left,
        .face__mouth-right,
        .face__nose,
        .face__pupil {
          animation: eyesIntro 1s 0.3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        .face__eye-lid,
        .face__pupil {
          animation-duration: 4s;
          animation-delay: 1.3s;
          animation-iteration-count: infinite;
        }

        .face__eye-lid {
          animation-name: eyeLidBlink;
        }

        .face__mouth-left,
        .face__mouth-right {
          animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
        }

        .face__mouth-left {
          animation-name: mouthLeftDraw;
        }

        .face__mouth-right {
          animation-name: mouthRightDraw;
        }

        .face__nose {
          animation-name: noseDrop;
        }

        .face__pupil {
          animation-name: pupilLook;
        }

        /* 1. Initial 4 0 4 morph: The 4s rise to become eyes, the 0 drops to become nose */
        @keyframes eyesIntro {
          from {
            transform: translateY(112.5px);
          }
          to {
            transform: translateY(15px);
          }
        }

        @keyframes noseDrop {
          from {
            transform: translate(0, 0);
          }
          to {
            transform: translate(0, 22.5px);
          }
        }

        /* 2. Mouth draws in from the center */
        @keyframes mouthLeftDraw {
          from,
          50% {
            stroke-dashoffset: -102;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes mouthRightDraw {
          from,
          50% {
            stroke-dashoffset: 102;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        /* 3. Eye blinking */
        @keyframes eyeLidBlink {
          from,
          40%,
          45%,
          to {
            transform: translateY(0);
          }
          42.5% {
            transform: translateY(17.5px);
          }
        }

        /* 4. Pupils looking left, right, and down */
        @keyframes pupilLook {
          from,
          37.5%,
          40%,
          45%,
          87.5%,
          to {
            stroke-dashoffset: 0;
            transform: translate(0, 0);
          }
          12.5%,
          25%,
          62.5%,
          75% {
            stroke-dashoffset: 0;
            transform: translate(-35px, 0);
          }
          42.5% {
            stroke-dashoffset: 35;
            transform: translate(0, 17.5px);
          }
        }
      `}</style>

      {/* Top Header with Brand */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary-100 shadow-sm">
            <Image
              src="/images/original/logo.jpg"
              alt="Neetha Nursing Service"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tight">
            Neetha Nursing Service
          </span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
          <span>Error 404</span>
        </div>
      </header>

      {/* Center Animated 404 Face & Messaging */}
      <main className="flex flex-col items-center justify-center my-auto space-y-6 text-center max-w-md px-4">
        {/* Animated Face Container with subtle royal purple glow */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-primary-100/80 shadow-[0_10px_35px_rgba(122,0,223,0.06)]">
          <svg
            className="face text-primary-700"
            viewBox="0 0 320 380"
            aria-label="A 404 morphs into an animated clinical face"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            >
              {/* Eyes (derived from the two '4's) */}
              <g className="face__eyes" transform="translate(0, 112.5)">
                {/* Left Eye */}
                <g transform="translate(15, 0)">
                  <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                  <polyline
                    className="face__pupil stroke-primary-900"
                    points="55,120 55,155"
                    strokeDasharray="35 35"
                  />
                </g>
                {/* Right Eye */}
                <g transform="translate(230, 0)">
                  <polyline className="face__eye-lid" points="37,0 0,120 75,120" />
                  <polyline
                    className="face__pupil stroke-primary-900"
                    points="55,120 55,155"
                    strokeDasharray="35 35"
                  />
                </g>
              </g>

              {/* Nose (derived from the '0') */}
              <rect
                className="face__nose stroke-primary-600"
                rx="6"
                ry="6"
                x="132.5"
                y="112.5"
                width="55"
                height="155"
              />

              {/* Frowning Sad Mouth */}
              <g strokeDasharray="102 102" transform="translate(65, 334)">
                <path
                  className="face__mouth-left stroke-primary-500"
                  d="M 0 30 C 0 30 40 0 95 0"
                  strokeDashoffset="-102"
                />
                <path
                  className="face__mouth-right stroke-primary-500"
                  d="M 95 0 C 150 0 190 30 190 30"
                  strokeDashoffset="102"
                />
              </g>
            </g>
          </svg>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            We couldn’t find that page
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mx-auto">
            The page you were looking for might have been moved or doesn’t exist. Our clinical caregivers are still on call.
          </p>
        </div>

        {/* Action Buttons styled like Neetha Nursing theme */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-all active:scale-95"
          >
            <Stethoscope className="w-4 h-4 text-primary-600" />
            <span>Book a Nurse</span>
          </Link>
        </div>
      </main>

      {/* Bottom Helpline Strip */}
      <footer className="w-full max-w-4xl pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Need immediate home nursing in Hyderabad?</span>
        </div>
        <a
          href="tel:+918341069693"
          className="inline-flex items-center gap-1.5 font-bold text-primary-700 hover:text-primary-800 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 24/7 Coordinator: +91 83410 69693</span>
        </a>
      </footer>
    </div>
  );
}
