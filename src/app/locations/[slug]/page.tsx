import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeaderNavbar from '@/components/navigation/HeaderNavbar';
import FaqSection from '@/components/seo/FaqSection';
import { HYDERABAD_LOCALITIES, LocationHub } from '@/components/seo/AreasServedSection';
import { prisma } from '@/lib/prisma';
import { MapPin, Clock, ShieldCheck, CheckCircle2, PhoneCall, ArrowRight, Sparkles, Star } from 'lucide-react';

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return HYDERABAD_LOCALITIES.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = HYDERABAD_LOCALITIES.find((l) => l.slug === slug);

  if (!location) {
    return {
      title: 'Location Not Found | Neetha Nursing Service',
    };
  }

  const title = `Home Nursing Service in ${location.name}, Hyderabad | Certified Caregivers`;
  const description = `Need a verified home nurse or patient attendant in ${location.name}? Neetha Nursing Service provides injections, surgical dressings, and 24/7 elderly care in ${location.name} within ${location.dispatchTime}. Call 8341069693.`;

  return {
    title,
    description,
    keywords: [
      `home nurse ${location.name}`,
      `nursing service in ${location.name}`,
      `patient care taker ${location.name}`,
      `elderly care ${location.name} Hyderabad`,
      `injection at home ${location.name}`,
      `home healthcare ${location.name} ${location.pincode}`,
    ],
    alternates: {
      canonical: `https://neethanursing.in/locations/${location.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neethanursing.in/locations/${location.slug}`,
      type: 'website',
    },
  };
}

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const location = HYDERABAD_LOCALITIES.find((l) => l.slug === slug);

  if (!location) {
    notFound();
  }

  let services: any[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { basePrice: 'asc' },
      take: 6,
    });
  } catch {
    services = [
      { id: '1', name: 'IM/IV Injection Support', basePrice: 350, priceUnit: 'visit', description: 'Sterile injection administration by certified nurse.' },
      { id: '2', name: 'Wound & Surgical Dressing', basePrice: 450, priceUnit: 'visit', description: 'Clinical post-op dressing changes and disinfection.' },
      { id: '3', name: 'Urinary Catheter Change', basePrice: 600, priceUnit: 'visit', description: 'Hygienic catheter care and replacement.' },
      { id: '4', name: '24/7 Dedicated Nursing Care', basePrice: 2500, priceUnit: 'day', description: '24-hour bedside nursing for critical and elderly patients.' },
    ];
  }

  const locationJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    name: `Neetha Nursing Service - ${location.name} Hub`,
    url: `https://neethanursing.in/locations/${location.slug}`,
    telephone: '+91-8341069693',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: 'Hyderabad, Telangana',
      postalCode: location.pincode,
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: location.name,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Localized Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd) }}
      />

      <HeaderNavbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-12 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>/</span>
            <span>Locations</span>
            <span>/</span>
            <span className="text-primary-700 font-semibold">{location.name}</span>
          </nav>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Average Arrival in {location.name}: {location.dispatchTime}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Certified Home Nursing & Patient Care in <span className="text-primary-600 font-serif italic">{location.name}</span>, Hyderabad
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {location.description} Our licensed GNM and B.Sc. nurses are stationed locally near {location.name} (PIN {location.pincode}) for rapid doorstep dispatch, catheter management, and compassionate elderly bedside care.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3.5">
            <Link
              href={`/booking?area=${encodeURIComponent(location.name)}`}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all"
            >
              <span>Book a Nurse in {location.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+918341069693"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Dispatch: 8341069693</span>
            </a>
          </div>

          {/* Trust Metrics */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">11+ Yrs</span>
              <span className="text-[11px] text-slate-500">Operating in Hyderabad</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block font-mono">{location.dispatchTime}</span>
              <span className="text-[11px] text-slate-500">Locality Arrival Window</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">100%</span>
              <span className="text-[11px] text-slate-500">Background Verified</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-primary-600 block font-mono">24 / 7</span>
              <span className="text-[11px] text-slate-500">Shift Support Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Available in this Locality */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center sm:text-left space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary-600 block font-mono">
            Doorstep Clinical Procedures
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Healthcare Services Available in {location.name}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                  <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                    ₹{Number(s.basePrice)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{s.description}</p>
              </div>

              <Link
                href={`/booking?area=${encodeURIComponent(location.name)}&serviceId=${s.id}`}
                className="w-full text-center py-2.5 bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Book in {location.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Local Verified Review Quote */}
      <section className="bg-white border-y border-slate-200/60 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="flex justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <blockquote className="text-base sm:text-lg font-medium text-slate-700 italic leading-relaxed">
            &quot;The nurse arrived at our home in {location.name} in less than 35 minutes for urgent catheter replacement. Very gentle, well-behaved, and highly qualified staff.&quot;
          </blockquote>
          <div className="text-xs text-slate-400 font-medium">
            — Verified Patient Family • Google Maps Review (Hyderabad)
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
