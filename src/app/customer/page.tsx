import React from 'react';
import { getCustomerSession, getCustomerBookings } from '@/actions/customer';
import { redirect } from 'next/navigation';
import CustomerDashboardView from '@/components/customer/CustomerDashboardView';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomerDashboardPage() {
  const session = await getCustomerSession();

  if (!session) {
    redirect('/customer/login');
  }

  const bookingsRes = await getCustomerBookings();
  const bookings = bookingsRes.success ? (bookingsRes.bookings || []) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary-500/20">
              <Image
                src="/images/original/logo.jpg"
                alt="Neetha Nursing Service Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">Neetha Nursing Service</span>
              <span className="text-[10px] text-emerald-400 font-bold block">Patient & Family Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white font-medium transition-colors"
            >
              Public Website
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <CustomerDashboardView
          customer={session}
          bookings={bookings}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Neetha Nursing Service. Patient Health Data Protected under DPDP Act 2023.
      </footer>
    </div>
  );
}
