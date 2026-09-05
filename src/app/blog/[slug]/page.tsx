import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import HeaderNavbar from '@/components/navigation/HeaderNavbar';
import Footer from '@/components/navigation/Footer';
import ClinicalReviewBadge from '@/components/blog/ClinicalReviewBadge';
import EmergencyRedFlags from '@/components/blog/EmergencyRedFlags';
import InArticleBookingCard from '@/components/blog/InArticleBookingCard';
import TableOfContents from '@/components/blog/TableOfContents';
import ClinicalFaqSection from '@/components/blog/ClinicalFaqAccordion';
import { BLOG_ARTICLES } from '@/data/blogArticles';
import { HYDERABAD_LOCALITIES } from '@/components/seo/AreasServedSection';
import {
  Calendar,
  Clock,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Sparkles,
  Share2,
  BookOpen
} from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Guide Not Found | Neetha Nursing Service',
    };
  }

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `https://neethanursing.in/blog/${article.slug}`,
    },
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      url: `https://neethanursing.in/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: `https://neethanursing.in${article.heroImage.src}`,
          alt: article.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.metaDescription,
      images: [`https://neethanursing.in${article.heroImage.src}`],
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const primaryServiceSlug = article.relatedServiceSlugs[0] || 'post-surgical-care';
  const whatsappUrl = `https://wa.me/918341069693?text=${encodeURIComponent(
    `Hello Neetha Nursing, I read your clinical FAQ guide on "${article.title}" and need nursing support in Hyderabad.`
  )}`;

  // Aggregate all clinical FAQs for structured FAQPage JSON-LD schema
  const allQuestions = [
    ...(article.criticalQuestions || []),
    ...(article.practicalQuestions || []),
    ...(article.curiousQuestions || []),
  ];

  // Multi-Schema JSON-LD Graph
  const structuredDataGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `https://neethanursing.in/blog/${article.slug}#webpage`,
        url: `https://neethanursing.in/blog/${article.slug}`,
        name: article.seoTitle,
        description: article.metaDescription,
        aspect: ['Diagnosis', 'Treatment', 'Prevention'],
        reviewedBy: {
          '@type': 'Person',
          name: article.clinicalReviewer.name,
          jobTitle: article.clinicalReviewer.role,
          hasCredential: article.clinicalReviewer.credentials,
          worksFor: {
            '@type': 'MedicalBusiness',
            name: 'Neetha Nursing Service',
            url: 'https://neethanursing.in',
          },
        },
        medicalAudience: 'PatientFamily',
        specialty: 'Nursing',
      },
      {
        '@type': 'BlogPosting',
        '@id': `https://neethanursing.in/blog/${article.slug}#article`,
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        image: `https://neethanursing.in${article.heroImage.src}`,
        author: {
          '@type': 'Organization',
          name: article.author.name,
          url: 'https://neethanursing.in/about',
        },
        publisher: {
          '@type': 'MedicalBusiness',
          name: 'Neetha Nursing Service',
          url: 'https://neethanursing.in',
          logo: 'https://neethanursing.in/images/original/logo.jpg',
        },
        mainEntityOfPage: `https://neethanursing.in/blog/${article.slug}`,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://neethanursing.in/blog/${article.slug}#faq`,
        mainEntity: allQuestions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${q.shortAnswer} ${q.detailedAnswer.join(' ')}`,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://neethanursing.in/blog/${article.slug}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://neethanursing.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Clinical Care Guides',
            item: 'https://neethanursing.in/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `https://neethanursing.in/blog/${article.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-primary-500 selection:text-white">
      {/* Inject Multi-Schema JSON-LD Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
      />

      <div>
        <HeaderNavbar />

        {/* Article Breadcrumbs & Header */}
        <div className="bg-slate-950 text-white border-b border-slate-800 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Breadcrumb row */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <Link href="/blog" className="hover:text-white transition-colors">Care Guides</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-primary-300 font-medium">{article.categoryLabel}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-primary-900/90 border border-primary-500/50 text-primary-300 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                {article.categoryLabel}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTimeMinutes} min read</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">
                Updated {new Date(article.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-serif leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl pt-1">
              {article.metaDescription}
            </p>
          </div>
        </div>

        {/* Main Article Container */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left Column: Article Body (8 cols) */}
            <article className="lg:col-span-8 space-y-8">
              {/* Clinical Review Badge */}
              <ClinicalReviewBadge
                reviewer={article.clinicalReviewer}
                lastReviewedDate={article.updatedAt}
              />

              {/* Hero Image */}
              <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md bg-slate-200">
                <Image
                  src={article.heroImage.src}
                  alt={article.heroImage.alt}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Key Takeaways Box */}
              {article.keyTakeaways && article.keyTakeaways.length > 0 && (
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Key Takeaways for Caregivers & Families</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {article.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mobile Table of Contents */}
              <div className="lg:hidden">
                <TableOfContents items={article.tableOfContents} />
              </div>

              {/* Emergency Red Flags Callout */}
              <EmergencyRedFlags flags={article.emergencyRedFlags} />

              {/* Comprehensive Clinical FAQ Knowledge Engine */}
              <ClinicalFaqSection
                criticalQuestions={article.criticalQuestions || []}
                practicalQuestions={article.practicalQuestions || []}
                curiousQuestions={article.curiousQuestions || []}
              />

              {/* Main Content Sections */}
              <div className="space-y-8">
                {article.contentSections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif pt-2 border-t border-slate-200/60">
                      {section.heading}
                    </h2>

                    <div className="space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed">
                      {section.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Optional Callout */}
                    {section.callout && (
                      <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded-r-xl space-y-1 my-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-primary-800">
                          {section.callout.title}
                        </div>
                        <p className="text-xs text-primary-900 leading-relaxed">
                          {section.callout.text}
                        </p>
                      </div>
                    )}

                    {/* Optional Bullet Points */}
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pl-4 list-disc">
                        {section.bulletPoints.map((point, ptIdx) => (
                          <li key={ptIdx} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* In-Article Conversion Booking Banner */}
              <InArticleBookingCard
                primaryServiceSlug={primaryServiceSlug}
                articleTitle={article.title}
              />

              {/* Localities Served Cross-Links */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Immediate Home Nurse Dispatch Across Hyderabad</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our certified nursing team serves patients across the following West Hyderabad neighborhoods with 30–45 minute emergency arrival:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {HYDERABAD_LOCALITIES.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/locations/${loc.slug}`}
                      className="text-xs font-semibold bg-slate-100 hover:bg-primary-100 text-slate-700 hover:text-primary-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Right Column: Sticky Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Desktop Table of Contents */}
                <div className="hidden lg:block">
                  <TableOfContents items={article.tableOfContents} />
                </div>

                {/* Quick Consultation & Booking Widget */}
                <div className="bg-gradient-to-br from-slate-900 to-primary-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-primary-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span>Need A Home Nurse Today?</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">
                      Book Verified Caregivers
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Zero advance fee. Hospital-verified GNM/B.Sc nurses for injections, dressings & 24/7 care.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <Link
                      href="/booking"
                      className="block text-center w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Book Visit Online
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs shadow-md transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Coordinator</span>
                    </a>
                    <a
                      href="tel:+918341069693"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call +91 8341069693</span>
                    </a>
                  </div>
                </div>

                {/* Related Clinical Services */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Related Clinical Procedures
                  </h4>
                  <div className="space-y-2">
                    {article.relatedServiceSlugs.map((sSlug) => (
                      <Link
                        key={sSlug}
                        href={`/services/${sSlug}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-700 text-xs font-bold text-slate-700 transition-colors group"
                      >
                        <span className="capitalize">{sSlug.replace(/-/g, ' ')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-primary-600 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center gap-2.5 shadow-2xl">
        <a
          href="tel:+918341069693"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call 8341069693</span>
        </a>
        <Link
          href="/booking"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Care Visit</span>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
