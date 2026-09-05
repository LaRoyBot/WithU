import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HeaderNavbar from '@/components/navigation/HeaderNavbar';
import FaqSection from '@/components/seo/FaqSection';
import { ShieldCheck, CheckCircle2, Clock, PhoneCall, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import Footer from '@/components/navigation/Footer';
import { BLOG_ARTICLES } from '@/data/blogArticles';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_SERVICES = [
  { id: 'fallback-1', name: 'IM/IV Injection Support', slug: 'im-iv-injections', basePrice: 350.0, priceUnit: 'visit', description: 'Administration of intramuscular or intravenous injections by a certified nurse at your home.', minimumDays: 1 },
  { id: 'fallback-2', name: 'Wound & Surgical Dressing', slug: 'wound-surgical-dressing', basePrice: 450.0, priceUnit: 'visit', description: 'Sterile dressing changes for post-surgical wounds, diabetic ulcers, or other lacerations.', minimumDays: 1 },
  { id: 'fallback-3', name: 'Urinary Catheter Change', slug: 'urinary-catheter-change', basePrice: 600.0, priceUnit: 'visit', description: 'Hygienic insertion, removal, or replacement of urinary catheters.', minimumDays: 1 },
  { id: 'fallback-4', name: '24/7 Dedicated Nursing Care', slug: 'dedicated-24-7-nursing', basePrice: 2500.0, priceUnit: 'day', description: 'Continuous 24-hour round-the-clock shift nursing for critical or elderly patients.', minimumDays: 7 },
  { id: 'fallback-5', name: 'IV Infusion & Hydration Therapy', slug: 'iv-infusion-hydration', basePrice: 500.0, priceUnit: 'visit', description: 'Setup and monitoring of intravenous fluids, vitamins, or hydration therapy at home.', minimumDays: 1 },
  { id: 'fallback-6', name: 'At-Home IVF Injection Support', slug: 'at-home-ivf-support', basePrice: 400.0, priceUnit: 'visit', description: 'Scheduled daily hormone injections for IVF cycles administered timely by a nurse.', minimumDays: 1 },
  { id: 'fallback-7', name: 'Post-Surgical Nursing Care', slug: 'post-surgical-care', basePrice: 1500.0, priceUnit: 'day', description: '12-hour or 24-hour recovery assistance including vitals monitoring, medications, and support.', minimumDays: 1 },
  { id: 'fallback-8', name: 'Physiotherapy & Rehabilitation', slug: 'physiotherapy-rehab', basePrice: 800.0, priceUnit: 'visit', description: 'Home-based physical therapy exercises for stroke recovery, joint replacement, or mobility issues.', minimumDays: 1 },
];

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    if (services.length > 0) return services.map((s) => ({ slug: s.slug }));
  } catch {}

  return FALLBACK_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  let service = null;
  try {
    service = await prisma.service.findUnique({ where: { slug } });
  } catch {}
  if (!service) {
    service = FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  }

  if (!service) {
    return {
      title: 'Service Not Found | Neetha Nursing Service',
    };
  }

  const title = `${service.name} at Home in Hyderabad | Neetha Nursing Service`;
  const description = `${service.description} Doorstep certified GNM/BSc nurses available 24/7 across Hyderabad. Starting at ₹${Number(service.basePrice)} per ${service.priceUnit}. Call 8341069693.`;

  return {
    title,
    description,
    keywords: [
      service.name,
      `${service.name} at home Hyderabad`,
      `${service.name} nurse near me`,
      'home nursing service Hyderabad',
      'certified bedside nurse Hyderabad',
    ],
    alternates: {
      canonical: `https://neethanursing.in/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://neethanursing.in/services/${service.slug}`,
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  let service = null;

  try {
    service = await prisma.service.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn('DB search failed. Trying fallbacks.');
  }

  if (!service) {
    service = FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  }

  if (!service) {
    notFound();
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    description: service.description,
    procedureType: 'NoninvasiveProcedure',
    offers: {
      '@type': 'Offer',
      price: Number(service.basePrice),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      eligibleRegion: {
        '@type': 'City',
        name: 'Hyderabad',
      },
    },
    provider: {
      '@type': 'MedicalBusiness',
      name: 'Neetha Nursing Service',
      telephone: '+91-8341069693',
      url: 'https://neethanursing.in',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Structured Data for Procedure */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <HeaderNavbar />

      <main className="max-w-4xl mx-auto py-12 px-6 flex-1 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-slate-600">Services</Link>
          <span>/</span>
          <span className="text-primary-700 font-semibold">{service.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            Verified Clinical Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {service.name} at Home
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            {service.description}
          </p>
        </div>

        {/* Pricing Card & Clinical Guidelines Grid */}
        <div className="grid gap-6 md:grid-cols-3 items-start">
          {/* Rate Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 text-center md:col-span-1 shadow-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
              Transparent Pricing
            </span>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono block">
                ₹{Number(service.basePrice)}
              </span>
              <span className="text-xs text-slate-400 font-medium">per {service.priceUnit}</span>
            </div>
            <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 py-1.5 px-2 rounded-lg font-semibold">
              Min. commitment: {service.minimumDays} {service.priceUnit}(s)
            </div>
            <Link
              href={`/booking?serviceId=${service.id}`}
              className="w-full inline-flex justify-center items-center py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wider shadow-lg"
            >
              Book This Service
            </Link>
          </div>

          {/* Guidelines */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-600 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base">What to Expect During Your Home Visit</h3>
            <ul className="space-y-3 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Our caregiver arrives in professional clinical uniform carrying government ID and nurse credentials.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strict sterile techniques followed for wound disinfection, catheter handling, and safe disposal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standard vital signs check (BP, Pulse, Temperature, SpO2) conducted and recorded on every visit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct coordination with treating physicians and family members with continuous supervisor oversight.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need urgent clinical advice?</span>
              <a
                href="tel:+918341069693"
                className="text-primary-700 hover:text-primary-800 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 8341069693</span>
              </a>
            </div>
          </div>

          {/* Related Clinical Knowledge & Care Guides */}
          {(() => {
            const relatedGuides = BLOG_ARTICLES.filter((a) =>
              a.relatedServiceSlugs.includes(service.slug)
            );
            if (relatedGuides.length === 0) return null;

            return (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary-600" />
                    <span>Clinical Guides & Family Care Advice for {service.name}</span>
                  </h3>
                  <Link href="/blog" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                    View All Guides →
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/blog/${guide.slug}`}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-primary-50/60 hover:border-primary-200 transition-all group space-y-1.5"
                    >
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600">
                        {guide.categoryLabel} • {guide.readTimeMinutes} min read
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-primary-800 leading-snug line-clamp-2">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {guide.metaDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      <FaqSection />
      <Footer />
    </div>
  );
}
