'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestCustomerOtp, verifyCustomerOtp } from '@/actions/customer';
import Link from 'next/link';

export default function CustomerLoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await requestCustomerOtp(phone, channel);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setOtpSent(true);
      setSuccessMsg(res.message || 'OTP sent successfully!');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await verifyCustomerOtp(otpCode);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/customer');
      router.refresh();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <span className="inline-block p-3 rounded-full bg-primary-950/80 border border-primary-500/20 text-primary-400 mb-3 text-2xl">
          📱
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight">Patient / Customer Login</h1>
        <p className="text-xs text-slate-400 mt-1">
          Access your active home nursing bookings, caregiver details, and care logs via Instant OTP.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-start gap-2">
          <span className="text-red-400 font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-start gap-2">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {devOtpHint && (
        <div className="mb-4 p-3 bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs rounded-xl text-center">
          Developer Test OTP: <strong className="text-white font-mono text-sm tracking-widest">{devOtpHint}</strong>
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 bg-slate-950 border border-r-0 border-slate-800 text-slate-400 text-xs rounded-l-xl font-mono">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                required
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Deliver Code Via
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'WHATSAPP'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'SMS'
                    ? 'bg-primary-950/60 border-primary-500/50 text-primary-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>📩</span>
                <span>SMS Message</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-900/50 disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? 'Sending Verification Code...' : `Send OTP via ${channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS'}`}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Enter 6-Digit OTP
              </label>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[11px] text-primary-400 hover:underline"
              >
                Change Number
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              required
              autoFocus
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-center text-lg font-mono tracking-widest placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-900/50 disabled:opacity-50 cursor-pointer text-center"
          >
            {loading ? 'Verifying OTP...' : 'Verify & Access My Bookings'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-2">
        <p className="text-[11px] text-slate-500">
          No password needed. Optional login to check your family's booking status anytime.
        </p>
        <div>
          <Link href="/" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
            ← Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
