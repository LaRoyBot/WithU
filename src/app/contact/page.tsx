import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs">
          <Link href="/" className="text-sm font-bold text-primary-700">Neetha Nursing Service</Link>
          <Link href="/services" className="hover:text-primary-600">Services</Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto py-16 px-4 flex-1 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 font-tight">Contact Our Coordinators</h1>
          <p className="text-xs text-gray-500">Reach out for immediate caregiver allocations or pricing questions.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-xs">
          {/* Contact Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4 text-gray-600">
            <div>
              <span className="font-bold text-gray-900 text-sm block">Support Desk</span>
              <p className="mt-1">📞 Call Center: +91 98765 43210</p>
              <p className="mt-1">💬 WhatsApp Chat: +91 98765 43210</p>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Registered Office</span>
              <p className="mt-1">Neetha Nursing Service Clinic,</p>
              <p>Main Road, Lingampally,</p>
              <p>Hyderabad, Telangana, 500019</p>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Work Hours</span>
              <p className="mt-1">Coordinator Desk: 8:00 AM - 10:00 PM Daily</p>
              <p>Emergency Nursing: 24/7 Operations Support</p>
            </div>
          </div>

          {/* Quick WhatsApp CTA Card */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 p-6 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-primary-800 text-sm">Need immediate care booking?</h4>
              <p className="text-gray-500 mt-2 leading-relaxed">
                Connect with our local coordinator directly on WhatsApp. We can discuss medical records, verify prescriptions, and allocate a caregiver within a few minutes.
              </p>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors text-center"
            >
              💬 Open WhatsApp Chat
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
