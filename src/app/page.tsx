import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold text-primary-700 tracking-tight">Neetha Nursing Service</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600">
            <Link href="/services" className="hover:text-primary-600">Our Services</Link>
            <Link href="/about" className="hover:text-primary-600">About Us</Link>
            <Link href="/contact" className="hover:text-primary-600">Contact</Link>
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">Admin Portal</Link>
          </nav>
          <div>
            <Link
              href="/booking"
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2.5 rounded-md transition-colors"
            >
              Book Home Visit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50/50 to-white py-16 md:py-24 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="inline-block bg-primary-100 border border-primary-200 text-primary-800 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            🏥 Professional Home Healthcare Services
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Certified Nursing & Elder Care at Your Doorstep
          </h1>
          <p className="text-sm md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Operating in Lingampally, Hyderabad since 2015. Get background-verified, compassionate nurses for injections, dressing, post-surgical rehabilitation, and elder care.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
            >
              Book a Visit Online
            </Link>
            <a
              href="https://wa.me/919876543210" // Mock WhatsApp link
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badge Bar */}
      <section className="bg-gray-50 border-y border-gray-100 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-2xl font-bold text-primary-700 block">11+ Years</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold mt-1 block">Serving Hyderabad</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary-700 block">100% Verified</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold mt-1 block">Background Audited Nurses</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary-700 block">15 Min</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold mt-1 block">Average Callback Time</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-primary-700 block">24/7 Care</span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold mt-1 block">Dedicated Shifts Available</span>
          </div>
        </div>
      </section>

      {/* Service Category Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Our Healthcare Offerings</h2>
          <p className="text-xs text-gray-500 mt-2">Vetted clinical nursing services tailored for family home recovery.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">💉</div>
            <h3 className="font-bold text-gray-900">IM/IV Injections</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Daily antibiotic injections, IVF medication, or hydration therapies administered sterilely at home.</p>
            <Link href="/services/im-iv-injections" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>

          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">🩹</div>
            <h3 className="font-bold text-gray-900">Wound & Surgical dressing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Surgical stitch care, diabetic wound cleaning, and bed-sore dressings under strict aseptic protocol.</p>
            <Link href="/services/wound-surgical-dressing" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>

          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">🚰</div>
            <h3 className="font-bold text-gray-900">Catheterization Change</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Insertion, removal, flushing, and cleaning of urinary foley catheters under sterile guidance.</p>
            <Link href="/services/urinary-catheter-change" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>

          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">👵</div>
            <h3 className="font-bold text-gray-900">Dedicated Elder Nursing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">24/7 dedicated caregiver matching for elderly parents suffering from dementia, paralysis, or age ailments.</p>
            <Link href="/services/dedicated-24-7-nursing" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>

          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">🤰</div>
            <h3 className="font-bold text-gray-900">IVF Injection Support</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Timely administration of critical hormonal injections at home required during IVF fertility cycles.</p>
            <Link href="/services/at-home-ivf-support" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>

          <div className="border border-gray-100 p-6 rounded-xl hover:shadow-md transition-all space-y-3">
            <div className="text-2xl">🤸</div>
            <h3 className="font-bold text-gray-900">Physiotherapy Visits</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Home-based exercises for orthopedic joint recovery, post-stroke paralysis rehabilitation, or mobility exercises.</p>
            <Link href="/services/physiotherapy-rehab" className="text-xs text-primary-600 font-bold block hover:underline">Read pricing & details →</Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">How to Book in 3 Steps</h2>
        </div>
        <div className="max-w-5xl mx-auto grid gap-8 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mx-auto text-sm">1</span>
            <h4 className="font-bold text-gray-900 text-sm">Select Service & Pricing</h4>
            <p className="text-xs text-gray-500">Pick the home nursing required and review base pricing up front. No hidden costs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mx-auto text-sm">2</span>
            <h4 className="font-bold text-gray-900 text-sm">Fill Patient Details</h4>
            <p className="text-xs text-gray-500">Submit patient details, medical needs, schedule dates, and authenticate via SMS OTP.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 text-center space-y-2">
            <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold mx-auto text-sm">3</span>
            <h4 className="font-bold text-gray-900 text-sm">Coordinator Call</h4>
            <p className="text-xs text-gray-500">A local coordinator will review patient conditions, match a nurse, and call to schedule the visit.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What Local Families Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 text-left">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-xs text-gray-500 italic">
              "We booked Neetha Nursing Service for 12-hour day care for my father after his hip replacement. Sister Anjali was extremely punctual, gentle with dressings, and kept daily logs of vitals. Strongly recommended in Hyderabad."
            </p>
            <div>
              <span className="font-semibold text-gray-900 text-xs block">- G. Srinivas (Lingampally)</span>
              <span className="text-[10px] text-gray-400 block">Service: Post-Surgical Care</span>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <p className="text-xs text-gray-500 italic">
              "Our coordinator matched Brother Raju for a catheterization change for my grandfather at home. Professional setup, took care of sterile requirements, and cost was reasonable compared to corporate agencies."
            </p>
            <div>
              <span className="font-semibold text-gray-900 text-xs block">- K. Padmaja (Miyapur)</span>
              <span className="text-[10px] text-gray-400 block">Service: Catheter Change</span>
            </div>
          </div>
        </div>
        {/* Placeholder flag as per instructions */}
        {/* TODO: replace with more real testimonials from customer ledger */}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-3 text-xs leading-relaxed">
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Neetha Nursing Service</h4>
            <p>At-Home Clinical Care solutions in Hyderabad since 2015. Professional nursing visits matched to family comfort.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Service Location</h4>
            <p>Lingampally, Hyderabad, Telangana, India.</p>
            <p className="mt-1">Serving: Lingampally, Miyapur, Kondapur, Gachibowli, Hafeezpet, BHEL.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact Support</h4>
            <p>📞 Phone: +91 98765 43210</p>
            <p>💬 WhatsApp: +91 98765 43210</p>
            <p>🕒 Hours: 24/7 Operations</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-[10px]">
          © {new Date().getFullYear()} Neetha Nursing Service. All rights reserved. Registered under DPDP Healthcare Consent frameworks.
        </div>
      </footer>
    </div>
  );
}
