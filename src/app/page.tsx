import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import QuickBookingForm from '@/components/booking/QuickBookingForm';
import HeaderNavbar from '@/components/navigation/HeaderNavbar';
import FaqSection from '@/components/seo/FaqSection';
import AreasServedSection from '@/components/seo/AreasServedSection';
import HeroBackgroundSlider from '@/components/hero/HeroBackgroundSlider';
import Footer from '@/components/navigation/Footer';
import { BLOG_ARTICLES } from '@/data/blogArticles';
import {
  ShieldCheck,
  Lock,
  Calendar,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ClipboardList,
  MessageCircle,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  let servicesList: any[] = [];
  try {
    servicesList = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.warn('DB not loaded in HomePage. Using fallbacks.');
  }

  if (servicesList.length === 0) {
    servicesList = [
      { id: 'fallback-1', name: 'IM/IV Injection Support', basePrice: 350.0, priceUnit: 'visit' },
      { id: 'fallback-2', name: 'Wound & Surgical Dressing', basePrice: 450.0, priceUnit: 'visit' },
      { id: 'fallback-3', name: 'Urinary Catheter Change', basePrice: 600.0, priceUnit: 'visit' },
      { id: 'fallback-4', name: '24/7 Dedicated Nursing Care', basePrice: 2500.0, priceUnit: 'day' },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-primary-500 selection:text-white">
      {/* Top Banner for Critical Updates / Trust */}
      <div className="bg-primary-950 text-white text-[11px] font-medium py-2 px-4 text-center border-b border-primary-900 tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          DPDP Act 2023 Compliant: All patient health information is cryptographically encrypted at rest.
        </span>
      </div>

      {/* Header / Navigation */}
      <HeaderNavbar />

      {/* Hero Section with Cinematic Sliding Background Carousel */}
      <HeroBackgroundSlider>
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          {/* Left Column: Value Proposition & Reassurance */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 bg-primary-950/80 border border-primary-500/40 text-primary-300 text-[11px] font-extrabold tracking-wider uppercase px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span>Certified Healthcare at Home • Since 2015</span>
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-sans drop-shadow-md">
              Professional nursing care, in your own <span className="text-primary-400 font-serif font-semibold italic">comfort home.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed drop-shadow">
              Operating across Lingampally, Gachibowli, Kondapur & Miyapur, Hyderabad. We bring certified, background-verified nurses to your doorstep for injections, sterile surgical dressings, post-operative recovery, and dedicated 24/7 elderly bedside support.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="group relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center bg-primary-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-primary-600/30 text-sm transition-shadow duration-[650ms] ease-spring hover:shadow-xl"
              >
                {/* Expanding Bubble Fill Effect from Bottom Center (scale-0 at rest prevents any visible bump) */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-primary-800 scale-0 transition-transform duration-[650ms] ease-spring group-hover:scale-100 pointer-events-none origin-center" />

                {/* Label (Shifts left on hover to reveal the incoming arrow) */}
                <span className="relative z-10 inline-flex items-center gap-1.5 transition-transform duration-[650ms] ease-spring group-hover:-translate-x-2.5">
                  Schedule Visit Now
                </span>

                {/* Sliding Arrow Icon (Enters smoothly from right overflow) */}
                <span className="absolute right-5 z-10 translate-x-4 opacity-0 transition-all duration-[650ms] ease-spring group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
              <a
                href="https://wa.me/918341069693"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-[#25D366]/30 hover:-translate-y-0.5 transition-all duration-200 text-sm gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>

            {/* Quick Hero Reassurance Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GNM / B.Sc. Verified Nurses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30 - 45 Min Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pay at Doorstep Option</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glassmorphism Booking Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative">
              {/* Subtle back illumination */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-3xl blur-xl" />
              <div className="relative">
                <QuickBookingForm services={servicesList} />
              </div>
            </div>
          </div>
        </div>
      </HeroBackgroundSlider>

      {/* Trust Badge Bar */}
      <section className="bg-white border-b border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">11+ Years</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Serving Hyderabad</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">100% Vetted</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Verified Nurses</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">AES-256</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Encrypted Patient PHI</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">24/7 Hours</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Clinical Operations</span>
          </div>
        </div>
      </section>

      {/* Clinical Offerings Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest block">Medical Specializations</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Our Professional Offerings</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Certified clinical treatments, critical post-operative support, and elderly care handled by qualified home nurses.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                💉
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IM Injections</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Safe, clinical Intramuscular injection administration for vitamins, hormones, and prescribed medicines at your doorstep (Rs. 299).</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/im-iv-injections" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🧪
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IV Injections</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Certified Intravenous injections and medication deliveries directly into the bloodstream by qualified nursing professionals (Rs. 399).</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/im-iv-injections" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🩹
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Wound Dressing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Expert wound cleaning, dressing, post-operative stitch cleaning, and management under strict aseptic standards (Rs. 399).</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/wound-surgical-dressing" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🚰
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Urine Pipe Change</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Safe and sterile urinary catheterization, insertion, cleaning, and urine pipe changes (Rs. 799).</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/urinary-catheter-change" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                💧
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IV Infusion & Saline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Home saline drip hydration, electrolyte management, nutrient fluids, and antibiotic IV lines administered safely.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/iv-infusion-hydration" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🤰
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IVF Injection Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Daily timed hormone therapy support and precise IVF injection administration in the comfort and privacy of your home.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/at-home-ivf-support" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 7 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🩺
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Post-Surgical Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Vitals monitoring, recovery assistance, medication coordination, and specialized nursing support following major surgeries.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/post-surgical-care" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 8 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                👵
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">24/7 Elder Nursing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Dedicated 12-hour or 24-hour home nursing service for complete geriatric medical support and long-term care (Rs. 2999/day).</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/dedicated-24-7-nursing" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read details <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nursing Team Section */}
      <section className="bg-white py-20 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest block">Our Team</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meet the key members of our organization</h2>
            <p className="text-sm text-slate-500 leading-relaxed">Dedicated leadership guiding our clinical home nursing operations with experience and care.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Team 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="relative w-28 h-28 overflow-hidden rounded-full border border-slate-100 mb-6">
                <Image
                  src="/images/original/team-1.jpg"
                  alt="Sunitha Yelamarthi"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Sunitha Yelamarthi</h4>
              <p className="text-sm text-slate-500 font-medium mb-1">CEO - Chief Executive Officer</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">16+ Years Of Experience</p>
            </div>

            {/* Team 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="relative w-28 h-28 overflow-hidden rounded-full border border-slate-100 mb-6">
                <Image
                  src="/images/original/team-2.jpg"
                  alt="Mareswara Rao"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Mareswara Rao</h4>
              <p className="text-sm text-slate-500 font-medium mb-1">CTO - Chief Technology Officer</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Experienced</p>
            </div>

            {/* Team 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="relative w-28 h-28 overflow-hidden rounded-full border border-slate-100 mb-6">
                <Image
                  src="/images/original/team-3.jpg"
                  alt="Prabhakar Rao"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Prabhakar Rao</h4>
              <p className="text-sm text-slate-500 font-medium mb-1">COO - Chief Operating Officer</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">25+ Years Of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* DPDP Compliance & Medical Data Security Section */}
      <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-10 w-[300px] h-[300px] bg-primary-900/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
              <Lock className="w-3.5 h-3.5" /> India DPDP Act 2023 Baseline
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Medical Data is Protected & Private</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              We take the privacy of patient health information (PHI) seriously. Under India's Digital Personal Data Protection Act of 2023, we require explicit patient/guardian consent before registering medical profiles, and all digital records are encrypted at rest.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck className="w-5 h-5 text-primary-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">AES-256-GCM Encryption</h4>
                  <p className="text-slate-400 mt-1">Health notes and prescriptions are encrypted at the application level.</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <ClipboardList className="w-5 h-5 text-primary-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-200">Strict Access Auditing</h4>
                  <p className="text-slate-400 mt-1">Every access to customer record is logged and strictly restricted to active coordinators.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <Image
              src="/images/original/hero-3.jpg"
              alt="Medical records confidentiality"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Areas We Serve: High-Demand Hyderabad Neighborhoods */}
      <AreasServedSection />

      {/* Patient Success Stories (Google Reviews with Slow Horizontal Scroll & Fade) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="flex text-amber-400">★★★★★</span>
            <span>5.0 / 5.0 Rating on Google Maps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by Families Across Gachibowli, Lingampally & Miyapur
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real Google Business reviews & verified case photos from local patients receiving compassionate home nursing and clinical support.
          </p>
        </div>

        {/* Slow horizontal marquee with smooth edge fade gradients */}
        <div className="relative w-full overflow-hidden">
          {/* Left and Right Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none"></div>

          {/* Marquee Track: Google Reviews Cards & Text */}
          <div className="animate-marquee flex gap-6 pb-2 items-stretch">
            {[
              {
                name: 'K. Venkatesh',
                location: 'Gachibowli, Hyderabad',
                date: '2 weeks ago',
                rating: 5,
                service: 'Post-Surgical Dressing & Care',
                review:
                  'Excellent nursing service at home! Nurse came on time for daily surgical dressing change and vitals monitoring after my father’s knee surgery. Very hygienic, polite, and skilled.',
              },
              {
                name: 'Sravani Reddy',
                location: 'Chanda Nagar / Lingampally',
                date: '1 month ago',
                rating: 5,
                service: 'IV Fluid Infusion & Injections',
                review:
                  'Called Neetha Nursing Service for urgent saline drip and antibiotic injection at home. The coordinator arranged a certified nurse in 30 minutes. Extremely reliable and caring service.',
              },
              {
                name: 'Ramesh Naidu',
                location: 'Miyapur, Hyderabad',
                date: '3 weeks ago',
                rating: 5,
                service: 'Catheterization / Urine Pipe',
                review:
                  'Prompt and painless urinary catheter replacement for our bedridden grandfather. Staff was thoroughly professional and handled everything with sterile precautions.',
              },
              {
                name: 'Dr. Ananya Rao',
                location: 'Gachibowli Financial District',
                date: '2 months ago',
                rating: 5,
                service: 'Elderly Home Care & Injections',
                review:
                  'Neetha Nursing is the most trusted home nursing provider in West Hyderabad. Transparent pricing, fast response on WhatsApp, and dedicated nurses who know their clinical protocols.',
              },
              {
                name: 'P. Srinivas Rao',
                location: 'Navodaya Colony, Gachibowli',
                date: '1 month ago',
                rating: 5,
                service: '24/7 Dedicated Nursing Support',
                review:
                  'We took 24-hour nursing support for my mother during post-op recovery. Nurse was diligent, compassionate, and kept in constant touch with doctors. Highly recommended!',
              },
              {
                name: 'Lakshmi Prasanna',
                location: 'BHEL / Serilingampalle',
                date: 'Recent',
                rating: 5,
                service: 'Wound Care & Stitches Cleaning',
                review:
                  'Very safe and dependable home nursing. The nurse cleaned diabetic wound ulcers with utmost patience and medical precision. Affordable charges too.',
              },
              // Duplicate set for seamless continuous marquee loop
              {
                name: 'K. Venkatesh',
                location: 'Gachibowli, Hyderabad',
                date: '2 weeks ago',
                rating: 5,
                service: 'Post-Surgical Dressing & Care',
                review:
                  'Excellent nursing service at home! Nurse came on time for daily surgical dressing change and vitals monitoring after my father’s knee surgery. Very hygienic, polite, and skilled.',
              },
              {
                name: 'Sravani Reddy',
                location: 'Chanda Nagar / Lingampally',
                date: '1 month ago',
                rating: 5,
                service: 'IV Fluid Infusion & Injections',
                review:
                  'Called Neetha Nursing Service for urgent saline drip and antibiotic injection at home. The coordinator arranged a certified nurse in 30 minutes. Extremely reliable and caring service.',
              },
              {
                name: 'Ramesh Naidu',
                location: 'Miyapur, Hyderabad',
                date: '3 weeks ago',
                rating: 5,
                service: 'Catheterization / Urine Pipe',
                review:
                  'Prompt and painless urinary catheter replacement for our bedridden grandfather. Staff was thoroughly professional and handled everything with sterile precautions.',
              },
              {
                name: 'Dr. Ananya Rao',
                location: 'Gachibowli Financial District',
                date: '2 months ago',
                rating: 5,
                service: 'Elderly Home Care & Injections',
                review:
                  'Neetha Nursing is the most trusted home nursing provider in West Hyderabad. Transparent pricing, fast response on WhatsApp, and dedicated nurses who know their clinical protocols.',
              },
              {
                name: 'P. Srinivas Rao',
                location: 'Navodaya Colony, Gachibowli',
                date: '1 month ago',
                rating: 5,
                service: '24/7 Dedicated Nursing Support',
                review:
                  'We took 24-hour nursing support for my mother during post-op recovery. Nurse was diligent, compassionate, and kept in constant touch with doctors. Highly recommended!',
              },
              {
                name: 'Lakshmi Prasanna',
                location: 'BHEL / Serilingampalle',
                date: 'Recent',
                rating: 5,
                service: 'Wound Care & Stitches Cleaning',
                review:
                  'Very safe and dependable home nursing. The nurse cleaned diabetic wound ulcers with utmost patience and medical precision. Affordable charges too.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-80 sm:w-96 shrink-0 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-primary-500/50 hover:bg-slate-800 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-purple-800 text-white font-black text-sm flex items-center justify-center shadow-md">
                        {item.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        <span className="text-[11px] text-slate-400 block">{item.location}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded bg-slate-700/60 text-primary-300 text-[10px] font-semibold">
                    {item.service}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Google Review
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Success Stories (Original Real Google Review Screenshots Grid) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest block">Verified Success</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reviews From Local Families</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Real Google Business review screenshots and patient feedback from families across Gachibowli, Lingampally, Miyapur, and BHEL whom we have served.</p>
        </div>

        {/* Grid for Google review screenshots */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Review 1 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-1.jpg"
                alt="Google Review Screenshot 1"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-3.jpg"
                alt="Google Review Screenshot 3"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-7.jpg"
                alt="Google Review Screenshot 7"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>

          {/* Review 4 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-[8/5.33] overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-4.jpg"
                alt="Google Review Screenshot 4"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>

          {/* Review 5 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-[8/5.33] overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-5.jpg"
                alt="Google Review Screenshot 5"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>

          {/* Review 6 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-[8/5.33] overflow-hidden rounded-xl">
              <Image
                src="/images/original/testimonial-6.jpg"
                alt="Google Review Screenshot 6"
                fill
                className="object-contain bg-slate-50 hover:scale-102 transition-transform duration-300"
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold uppercase tracking-wider">Verified Google Review</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions with Schema.org FAQPage Rich Snippet JSON-LD */}
      <FaqSection />

      {/* Clinical Knowledge & Family Care Guides (Positioned at bottom above footer) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <BookOpen className="w-3.5 h-3.5 text-primary-600" />
                <span>Clinical Care Guides & Health Literacy</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                Essential Nursing Knowledge & Family Care Guides
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Objective, medically reviewed answers to critical questions on post-operative healing, elderly bedsore prevention, catheter troubleshooting, and home procedures.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary-700 hover:text-primary-800 bg-white border border-slate-200 hover:border-primary-300 py-2.5 px-4 rounded-xl shadow-sm transition-all shrink-0"
            >
              <span>Explore All Guides & Clinical FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BLOG_ARTICLES.slice(0, 4).map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-primary-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-extrabold uppercase text-primary-600 tracking-wider text-[10px]">
                      {guide.categoryLabel}
                    </span>
                    <span>{guide.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {guide.metaDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-primary-600 font-bold">
                  <span>Read Clinical Q&A</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-tr from-primary-900 to-indigo-900 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Schedule Professional Care?</h2>
          <p className="text-primary-200 text-sm max-w-lg mx-auto">
            Book online and verify with SMS OTP. Our coordinator will match a registered nurse to review clinical reports.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white hover:bg-slate-50 text-primary-900 font-bold py-3.5 px-8 rounded-full text-sm transition-all"
            >
              Start Online Booking
            </Link>
            <a
              href="tel:+918341069693"
              className="border border-white/20 hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              📞 Call Coordinator
            </a>
          </div>
        </div>
      </section>

      {/* Reusable Comprehensive Footer */}
      <Footer />

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/918341069693"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
