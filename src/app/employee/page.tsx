import React from 'react';
import { getEmployeeSession, getAvailableJobs, getMyAssignedJobs } from '@/actions/employee';
import { redirect } from 'next/navigation';
import JobBoard from '@/components/employee/JobBoard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmployeeDashboardPage() {
  const session = await getEmployeeSession();

  if (!session) {
    redirect('/employee/login');
  }

  const [openJobsRes, assignedJobsRes] = await Promise.all([
    getAvailableJobs(),
    getMyAssignedJobs(),
  ]);

  const openJobs = openJobsRes.success ? (openJobsRes.jobs || []) : [];
  const assignedJobs = assignedJobsRes.success ? (assignedJobsRes.jobs || []) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm">
              W
            </span>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">WithU Caregiver</span>
              <span className="text-[10px] text-emerald-400 font-bold block">✓ Verified Active Nurse</span>
            </div>
          </div>

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
        <JobBoard
          employee={session}
          openJobs={openJobs}
          assignedJobs={assignedJobs}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Neetha Nursing Service (WithU Care Network). Internal Caregiver System.
      </footer>
    </div>
  );
}
