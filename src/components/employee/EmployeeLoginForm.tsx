'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { employeeLogin } from '@/actions/employee';

export default function EmployeeLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const result = await employeeLogin(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/employee');
      router.refresh();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-6">
        <span className="inline-block p-3 rounded-full bg-primary-950/80 border border-primary-500/20 text-primary-400 mb-3">
          🩺
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight">Caregiver Portal</h1>
        <p className="text-xs text-slate-400 mt-1">
          Login using credentials assigned by Neetha Nursing Administration.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-start gap-2">
          <span className="text-red-400 font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Registered Email or Mobile Phone
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nurse@withu.care or +919876543210"
            required
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-950/50 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Job Board'}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500">
          Account registration is administrator-only. To join the caregiver network, contact admin directly.
        </p>
      </div>
    </div>
  );
}
