'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Stethoscope, Shield, Calendar, Phone, Sparkles, Home, Info, ArrowRight, BookOpen } from 'lucide-react';

export default function HeaderNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary-100 group-hover:scale-105 transition-transform duration-200 shadow-sm">
            <Image
              src="/images/original/logo.jpg"
              alt="Neetha Nursing Service Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-900 tracking-tight leading-tight">Neetha Nursing</span>
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-tight">At-Home Healthcare</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-7 text-[13px] font-semibold text-slate-600 items-center">
          <Link href="/services" className="hover:text-primary-600 transition-colors">Our Services</Link>
          <Link href="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
          <Link href="/customer/login" className="text-slate-700 hover:text-primary-600 transition-colors flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-primary-600" />
            Patient Login
          </Link>
          <Link href="/employee/login" className="text-slate-600 hover:text-primary-600 transition-colors flex items-center gap-1.5 font-medium">
            <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
            Staff Login
          </Link>
          <Link href="/admin" className="text-slate-400 hover:text-primary-600 transition-colors text-xs font-mono">
            Admin
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/booking"
            className="group relative overflow-hidden inline-flex items-center justify-center bg-primary-600 text-white text-xs sm:text-[13px] font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-sm transition-shadow duration-[650ms] ease-spring hover:shadow-md"
          >
            {/* Expanding Bubble Fill Effect from Bottom Center (scale-0 at rest prevents any visible bump) */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-primary-800 scale-0 transition-transform duration-[650ms] ease-spring group-hover:scale-100 pointer-events-none origin-center" />

            {/* Label (Shifts left on hover to reveal the incoming arrow) */}
            <span className="relative z-10 inline-flex items-center gap-1.5 transition-transform duration-[650ms] ease-spring group-hover:-translate-x-2.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Book Visit</span>
            </span>

            {/* Sliding Arrow Icon (Enters smoothly from right overflow) */}
            <span className="absolute right-3.5 z-10 translate-x-4 opacity-0 transition-all duration-[650ms] ease-spring group-hover:translate-x-0 group-hover:opacity-100">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-primary-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down / Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 text-white animate-in slide-in-from-top duration-200">
          <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">
            {/* Quick Access Portals */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Portal Access & Logins
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/customer/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-primary-500/50 hover:bg-slate-800 transition-all text-xs font-semibold text-white group"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold">
                    📱
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-primary-300">Patient Login</div>
                    <div className="text-[10px] text-slate-400 font-normal">WhatsApp OTP</div>
                  </div>
                </Link>

                <Link
                  href="/employee/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-xs font-semibold text-white group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                    🩺
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-indigo-300">Staff Login</div>
                    <div className="text-[10px] text-slate-400 font-normal">Nurse & Carer</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Main Navigation Links */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
                Explore Website
              </span>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/60 text-slate-200 hover:text-white text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span>Clinical Nursing Services & Rates</span>
                </div>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/60 text-slate-200 hover:text-white text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-primary-400" />
                  <span>About Neetha Nursing Service</span>
                </div>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/60 text-slate-200 hover:text-white text-xs font-medium transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Contact & Coordinator Support</span>
                </div>
                <span className="text-slate-500">→</span>
              </Link>
            </div>

            {/* Quick Helpline & Admin footer inside mobile menu */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <a
                href="tel:+918341069693"
                className="text-emerald-400 font-semibold hover:underline flex items-center gap-1.5"
              >
                <span>📞 +91 8341069693</span>
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono"
              >
                Admin Control
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
