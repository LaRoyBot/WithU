import React from 'react';
import EmployeeLoginForm from '@/components/employee/EmployeeLoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Caregiver Login - WithU Healthcare',
  description: 'Employee caregiver portal for viewing and bidding on nursing jobs.',
};

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8">
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-black text-sm">
            W
          </span>
          <span className="font-bold text-white text-base tracking-tight">WithU Caregiver</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Main Site
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto my-8">
        <EmployeeLoginForm />
      </main>

      <footer className="text-center text-xs text-slate-600 py-4 max-w-5xl mx-auto w-full">
        &copy; {new Date().getFullYear()} WithU Care Network. Authorized Personnel Only.
      </footer>
    </div>
  );
}
