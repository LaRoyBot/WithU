import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MessageCircle
} from 'lucide-react';

export default function HomePage() {
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
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-primary-100 group-hover:scale-105 transition-transform duration-200">
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

          <nav className="hidden md:flex gap-8 text-[13px] font-semibold text-slate-600">
            <Link href="/services" className="hover:text-primary-600 transition-colors">Our Services</Link>
            <Link href="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
            <Link href="/admin" className="text-slate-400 hover:text-primary-600 transition-colors">Admin Portal</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/booking"
              className="bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-bold px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Book Home Visit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 px-6 border-b border-slate-100">
        {/* Subtle background glow matching kovai.co */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-extrabold tracking-wider uppercase px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              Certified Healthcare at Home
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-sans">
              Professional nursing care, in your own <span className="text-primary-600 font-serif font-semibold italic">comfort home.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
              Operating across Lingampally & Miyapur, Hyderabad since 2015. We bring certified, background-verified caregivers to your doorstep for injections, dressings, post-surgical recovery, and dedicated elderly support.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20 hover:-translate-y-0.5 transition-all duration-200 text-sm gap-2"
              >
                Schedule Visit Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919876543210"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 hover:-translate-y-0.5 transition-all duration-200 text-sm gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-3xl rotate-3 scale-95 opacity-5 blur-sm"></div>
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
              <Image
                src="/images/original/hero-1.jpg"
                alt="Certified Nurse providing care"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                💉
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IM/IV Injections</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Aseptic administration of daily antibiotic injections, IVF meds, and hydration drips at home.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/im-iv-injections" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🩹
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Surgical Dressing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Post-operative stitches cleaning, diabetic wound care, and bedsore dressings under strict hygiene standards.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/wound-surgical-dressing" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🚰
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Catheter Change</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Sterile insertion, flushing, and management of Foley urinary catheter lines by trained clinical caregivers.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/urinary-catheter-change" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                👵
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Dedicated Elder Nursing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">12-hour or 24-hour continuous care for seniors recovering from stroke, paralysis, or neurological conditions.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/dedicated-24-7-nursing" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🤰
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">IVF Injection Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Timely and clinical hormone injections for fertility treatments in the comfort of your home.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/at-home-ivf-support" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                🧘
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Physiotherapy Visits</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Joint mobility, sports injury physical therapy, and neuro-physiotherapy by expert therapists.</p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-50">
              <Link href="/services/physiotherapy-rehab" className="inline-flex items-center text-xs text-primary-600 font-bold hover:gap-1.5 transition-all">
                Read pricing & guidelines <ArrowRight className="w-3.5 h-3.5 ml-1" />
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

      {/* Patient Success Stories (Real Google Review Screenshots) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest block">Verified Success</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reviews From Local Families</h2>
          <p className="text-sm text-slate-500 leading-relaxed">Real Google Business review screenshots from families in Lingampally, Miyapur, and BHEL whom we have served.</p>
        </div>

        {/* Masonry-style/flex grid for Google review screenshots */}
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
              href="tel:+919876543210"
              className="border border-white/20 hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-full text-sm transition-all inline-flex items-center justify-center gap-2"
            >
              📞 Call Coordinator
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid gap-12 sm:grid-cols-3 text-xs leading-relaxed">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 overflow-hidden rounded-full border border-slate-800">
                <Image
                  src="/images/original/logo.jpg"
                  alt="Neetha Nursing Service Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white font-extrabold text-sm tracking-tight">Neetha Nursing Service</span>
            </div>
            <p className="text-slate-400">
              Registered clinical home healthcare and elder nursing service provider. Operating in West Hyderabad under professional clinical guidelines.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Operating Areas</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
              <p>Lingampally, Hyderabad, Telangana, India.<br />Serving: Lingampally, Miyapur, BHEL, Kondapur, Gachibowli, Madinaguda.</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Quick Contacts</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>Call: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-400" />
                <span>WhatsApp: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-400" />
                <span>24/7 Service Support</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} Neetha Nursing Service. All rights reserved. Encrypted with industrial standard AES-256-GCM. Fully aligned to India's DPDP Act, 2023.
        </div>
      </footer>

      {/* Floating WhatsApp FAB */}
      <a
        href="https://wa.me/919876543210"
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
