import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HYDERABAD_LOCALITIES } from '@/components/seo/AreasServedSection';
import { BLOG_ARTICLES } from '@/data/blogArticles';
import { ShieldCheck, Phone, HeartHandshake, BookOpen } from 'lucide-react';

export default function Footer() {
  const featuredArticles = BLOG_ARTICLES.slice(0, 5);

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Clinical Reassurance */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary-500/40">
                <Image
                  src="/images/original/logo.jpg"
                  alt="Neetha Nursing Service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white">Neetha Nursing</span>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">At-Home Healthcare</span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving Hyderabad families with certified bedside GNM/B.Sc nurses, sterile surgical dressing, injections, catheterization, and 24/7 elderly care since 2015.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Caregivers & DPDP Compliant</span>
              </div>
              <div>Head Office: Lingampally Hub, Hyderabad 500019</div>
            </div>
          </div>

          {/* Column 2: Clinical Care Guides (Blog) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Clinical & Family Guides</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              {featuredArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="hover:text-primary-300 transition-colors line-clamp-1"
                    title={article.title}
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-primary-400 font-semibold hover:text-primary-300 transition-colors"
                >
                  <span>Explore All Medical Guides</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operating Neighborhoods */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block">
              Hyderabad Localities Served
            </span>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-400">
              {HYDERABAD_LOCALITIES.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="hover:text-primary-300 transition-colors"
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: 24/7 Coordinator Contacts */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block">
              Immediate Help & Bookings
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              <a
                href="tel:+918341069693"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-colors group"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white group-hover:text-primary-300">+91 8341069693</div>
                  <div className="text-[10px] text-slate-400">24/7 Nurse Coordinator</div>
                </div>
              </a>
              <a
                href="tel:+919397925412"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 transition-colors group"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white group-hover:text-primary-300">+91 9397925412</div>
                  <div className="text-[10px] text-slate-400">Clinical Supervisor Desk</div>
                </div>
              </a>
              <Link
                href="/booking"
                className="block text-center w-full py-2 px-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Book Home Visit Online
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Neetha Nursing Service. All rights reserved. Registered Healthcare Provider in Telangana.
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Care Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/customer/login" className="hover:text-white transition-colors">Patient Login</Link>
            <Link href="/employee/login" className="hover:text-white transition-colors">Staff Login</Link>
            <Link href="/admin" className="font-mono text-slate-500 hover:text-slate-300">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
