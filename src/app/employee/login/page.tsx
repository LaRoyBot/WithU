import React from 'react';
import EmployeeLoginForm from '@/components/employee/EmployeeLoginForm';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Staff Login | Neetha Nursing Service',
  description: 'Employee & nurse staff portal for viewing and managing nursing visits.',
};

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-8">
      <header className="flex justify-between items-center max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary-500/20">
            <Image
              src="/images/original/logo.jpg"
              alt="Neetha Nursing Service Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-white text-base tracking-tight">Neetha Nursing Staff</span>
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
        &copy; {new Date().getFullYear()} Neetha Nursing Service. Authorized Staff Personnel Only.
      </footer>
    </div>
  );
}
