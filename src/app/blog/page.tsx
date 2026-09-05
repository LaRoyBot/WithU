import React from 'react';
import type { Metadata } from 'next';
import HeaderNavbar from '@/components/navigation/HeaderNavbar';
import Footer from '@/components/navigation/Footer';
import BlogDirectoryClient from '@/components/blog/BlogDirectoryClient';
import { BLOG_ARTICLES } from '@/data/blogArticles';
import { BookOpen, ShieldCheck, HeartHandshake, PhoneCall, Sparkles } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Clinical Care Guides & Home Healthcare Blog | Neetha Nursing Service',
  description: 'Evidence-based home nursing and clinical care guides for Hyderabad families. Medically reviewed protocols on post-operative care, bedsore prevention, diabetic wound dressing, and catheter management.',
  keywords: [
    'home nursing care guide hyderabad',
    'post operative care at home',
    'bedsores prevention bedridden patients',
    'diabetic foot ulcer dressing guide',
    'catheter care at home hyderabad',
    'ivf injections at home',
    'home health blog hyderabad'
  ],
  alternates: {
    canonical: 'https://neethanursing.in/blog',
  },
  openGraph: {
    title: 'Clinical Care Guides & Home Healthcare Blog | Neetha Nursing Service',
    description: 'Evidence-based home healthcare guides reviewed by licensed GNM/B.Sc nurses in Hyderabad.',
    url: 'https://neethanursing.in/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Clinical Care Guides & Home Healthcare Blog | Neetha Nursing Service',
    description: 'Evidence-based home nursing and clinical care guides for families in Hyderabad.',
    url: 'https://neethanursing.in/blog',
    publisher: {
      '@type': 'MedicalBusiness',
      name: 'Neetha Nursing Service',
      url: 'https://neethanursing.in',
      logo: 'https://neethanursing.in/images/original/logo.jpg',
      telephone: '+918341069693',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        postalCode: '500019',
        addressCountry: 'IN',
      },
    },
    hasPart: BLOG_ARTICLES.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      url: `https://neethanursing.in/blog/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: 'Neetha Nursing Service',
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      {/* Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <div>
        <HeaderNavbar />

        {/* Hero Header */}
        <section className="bg-slate-950 text-white border-b border-slate-800 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-slate-950 to-primary-950/60 pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-primary-950/90 border border-primary-500/40 text-primary-300 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span>Hyderabad Clinical Knowledge Hub</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Guides Medically Reviewed</span>
              </span>
            </div>

            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif leading-tight">
                Frequently Asked Clinical Questions & <span className="text-primary-400 italic font-medium">Family Care Guides.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Objective, medically accurate answers to critical questions on surgical wound dressing, bedsore prevention, catheter troubleshooting, and home procedures from certified registered nurses in Hyderabad.
              </p>
            </div>

            {/* Quick Emergency Dispatch Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="text-slate-400">Need immediate nurse dispatch in Hyderabad?</span>
              <a
                href="tel:+918341069693"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Coordinator: +91 8341069693 (30-45 Min Response)</span>
              </a>
            </div>
          </div>
        </section>

        {/* Main Directory Interactive Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <BlogDirectoryClient articles={BLOG_ARTICLES} />
        </main>
      </div>

      <Footer />
    </div>
  );
}
