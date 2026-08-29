import React from 'react';
import CustomerLoginForm from '@/components/customer/CustomerLoginForm';
import { getCustomerSession } from '@/actions/customer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Patient & Family Login | Neetha Nursing Service',
  description: 'Track your home nursing bookings and nurse details via OTP.',
};

export default async function CustomerLoginPage() {
  const session = await getCustomerSession();

  if (session) {
    redirect('/customer');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 overflow-hidden rounded-full border border-primary-500/20">
              <Image
                src="/images/original/logo.jpg"
                alt="Neetha Nursing Service Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">Neetha Nursing</span>
              <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest">Patient Portal</span>
            </div>
          </Link>

          <Link
            href="/booking"
            className="text-xs bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-full transition-all"
          >
            New Booking
          </Link>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="max-w-md w-full mx-auto px-4 py-12">
        <CustomerLoginForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Neetha Nursing Service. Patient Health Information encrypted under DPDP Act 2023.
      </footer>
    </div>
  );
}
