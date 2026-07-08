import React from 'react';
import Link from 'next/link';

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-primary-700 tracking-tight">Neetha Nursing Service</span>
            <span className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mt-0.5">At-Home Healthcare Since 2015</span>
          </Link>
        </div>

        {/* Outer Box */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
          {children}
        </div>

        {/* Verification & Trust Footer */}
        <div className="mt-6 flex justify-center items-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            🛡️ 100% Background Verified
          </span>
          <span className="flex items-center gap-1">
            🔒 DPDP Compliant Data Safe
          </span>
          <span className="flex items-center gap-1">
            📞 24/7 Support Active
          </span>
        </div>
      </div>
    </div>
  );
}
