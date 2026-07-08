'use client';

import React, { useState } from 'react';
import { adminLogin } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Direct redirect
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
        <div className="text-center">
          <span className="text-primary-400 font-mono tracking-widest text-xs uppercase font-bold">Admin Panel Secure Login</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">Neetha Nursing Service</h2>
          <p className="text-xs text-gray-400 mt-2 font-mono">// Access restricted to authorized coordinators</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded text-xs">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="coordinator@neethanursing.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-md font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <div className="text-center text-[10px] text-gray-500 font-mono pt-4 border-t border-gray-700">
          🔑 Default Seed Login: admin@neethanursing.com / admin123
        </div>
      </div>
    </div>
  );
}
