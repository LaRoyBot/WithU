import React from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/actions/admin';
import { adminLogout } from '@/actions/admin';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If no session and NOT loading the login page, the middleware handles the redirect.
  // But inside this layout, if we are logged in, we render the admin workspace.
  if (!session) {
    return <>{children}</>;
  }

  const handleLogoutAction = async () => {
    'use server';
    await adminLogout();
    redirect('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white shrink-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin">
            <span className="text-xl font-bold tracking-wider text-primary-400 font-mono">Neetha Admin</span>
            <span className="block text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Control Center v1.0</span>
          </Link>
          <div className="mt-3 text-xs text-gray-400">
            👋 {session.name} ({session.role.toLowerCase()})
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            📋 Bookings Queue
          </Link>
          <Link
            href="/admin/calendar"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            📅 Calendar Slots
          </Link>
          <Link
            href="/admin/roster"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            👩‍⚕️ Nurse Roster
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            💰 Services & Prices
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold"
          >
            📊 Analytics Reports
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto md:absolute md:bottom-0 md:w-64">
          <form action={handleLogoutAction}>
            <button
              type="submit"
              className="w-full text-center px-4 py-2 border border-red-900/50 hover:bg-red-950/20 text-red-400 hover:text-red-300 text-xs font-bold rounded transition-colors"
            >
              Sign Out Securely
            </button>
          </form>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
