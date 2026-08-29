'use client';

import React from 'react';
import { customerLogout } from '@/actions/customer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookingItem {
  id: string;
  bookingNumber: string;
  serviceName: string;
  totalAmount: number;
  status: string;
  shiftType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  area: string | null;
  patientName: string;
  medicalConditions: string;
  assignedNurse: {
    name: string;
    phone: string;
    qualification: string;
    experienceYears: number;
  } | null;
  createdAt: string;
}

interface CustomerDashboardViewProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string;
  };
  bookings: BookingItem[];
}

export default function CustomerDashboardView({ customer, bookings }: CustomerDashboardViewProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await customerLogout();
    router.push('/customer/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'NURSE_ASSIGNED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'IN_PROGRESS':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'COMPLETED':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-black text-lg">
            👤
          </span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome, {customer.name}</h1>
            <p className="text-xs text-slate-400 font-mono">
              Phone: {customer.phone} {customer.address ? `• Location: ${customer.address}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            + Book Home Visit
          </Link>
          <button
            onClick={handleSignOut}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Your Home Nursing Bookings ({bookings.length})
          </h2>
          <span className="text-xs text-slate-500">
            Real-time status of assigned nurses & clinical care visits.
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <p className="text-sm font-medium">No active or past bookings found for this mobile number.</p>
            <Link
              href="/booking"
              className="inline-block px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl"
            >
              Book Your First Nursing Visit
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono text-primary-400 font-bold block">
                      {b.bookingNumber}
                    </span>
                    <h3 className="text-base font-bold text-white">{b.serviceName}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(b.status)}`}>
                      {b.status.replace('_', ' ')}
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Patient Details
                    </span>
                    <p className="text-slate-200">Patient: <strong className="text-white">{b.patientName}</strong></p>
                    <p className="text-slate-300">Area: <span className="text-slate-400">{b.area || 'Hyderabad'}</span></p>
                    <p className="text-slate-300">Schedule: <span className="text-slate-400">{new Date(b.startDate).toLocaleDateString()} ({b.shiftType})</span></p>
                  </div>

                  <div className="space-y-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Assigned Caregiver / Nurse
                    </span>
                    {b.assignedNurse ? (
                      <div>
                        <p className="text-slate-200">Nurse: <strong className="text-emerald-400">{b.assignedNurse.name}</strong></p>
                        <p className="text-slate-300">Qualification: <span className="text-slate-400">{b.assignedNurse.qualification} ({b.assignedNurse.experienceYears} yrs exp)</span></p>
                        <p className="text-slate-300">Contact: <strong className="text-white font-mono">{b.assignedNurse.phone}</strong></p>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic pt-1">
                        Coordinator is currently matching a qualified registered nurse for your request.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
