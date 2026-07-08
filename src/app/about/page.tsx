import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs">
          <Link href="/" className="text-sm font-bold text-primary-700">Neetha Nursing Service</Link>
          <div className="flex gap-4">
            <Link href="/services" className="hover:text-primary-600">Services</Link>
            <Link href="/contact" className="hover:text-primary-600">Contact</Link>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto py-16 px-4 flex-1 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900">About Neetha Nursing Service</h1>
          <p className="text-sm text-gray-500 font-medium">Serving the home-nursing needs of Hyderabad since 2015.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 text-xs text-gray-600 leading-relaxed">
          <p>
            Established in Lingampally, Hyderabad, <strong>Neetha Nursing Service</strong> was founded with a single mission: to bridge the gap between hospital-grade clinical care and family comfort. We provide reliable, trained, and verified healthcare professionals directly to your home.
          </p>
          <p>
            Over the last decade, we have supported hundreds of families through difficult recoveries, elderly management, post-operative rehabilitation, and daily nursing procedures. Our nurses are background-audited, verified for training, and supervised by local medical coordinators.
          </p>

          <h3 className="font-bold text-gray-900 text-sm pt-2">Our Core Principles</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Clinical Excellence:</strong> All staff hold accredited GNM or B.Sc Nursing training credentials.</li>
            <li><strong>Transparency:</strong> No upfront deposit traps, hidden consumable surcharges, or opaque pricing.</li>
            <li><strong>DPDP Compliance:</strong> Patient health information is encrypted and protected with patient consent logging.</li>
            <li><strong>Hyderabad Focus:</strong> Restricting services to a local geography (Lingampally and surroundings) allows us to guarantee 24-hour backup caregivers.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
