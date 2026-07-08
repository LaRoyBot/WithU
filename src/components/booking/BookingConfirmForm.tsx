'use client';

import React, { useState, useEffect } from 'react';
import { verifyBookingOtp, resendBookingOtp } from '@/actions/booking';

interface BookingConfirmFormProps {
  bookingId: string;
  customerPhone: string;
  bookingNumber: string;
  totalAmount: number;
}

export default function BookingConfirmForm({
  bookingId,
  customerPhone,
  bookingNumber,
  totalAmount,
}: BookingConfirmFormProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verifiedNumber, setVerifiedNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer for OTP Resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    const response = await verifyBookingOtp(bookingId, otp);

    setIsVerifying(false);
    if (response.success && response.bookingNumber) {
      setSuccess(true);
      setVerifiedNumber(response.bookingNumber);
    } else {
      setError(response.error || 'Invalid verification code');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    const response = await resendBookingOtp(bookingId);

    setIsResending(false);
    if (response.success) {
      setResendTimer(60); // Reset timer
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Clear success indicator after 5s
    } else {
      setError(response.error || 'Failed to resend verification code');
    }
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-primary-200">
          ✓
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Booking Request Submitted!</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your phone number was verified successfully. Your booking reference number is:
          </p>
          <span className="inline-block bg-primary-50 text-primary-800 font-mono font-bold text-lg px-4 py-2 border border-primary-200 rounded mt-3">
            {verifiedNumber}
          </span>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Our care coordinator will call you back on <strong className="text-gray-600">{customerPhone}</strong> within 15 minutes to confirm nurse availability, shift timings, and finalize the care plan.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
          <a
            href={`/booking/status?id=${bookingId}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-md transition-colors shadow-sm"
          >
            Track Live Status Online
          </a>
          <a
            href="/"
            className="text-xs text-primary-600 hover:text-primary-800 font-semibold"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-gray-900">Phone Verification</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          We have sent a 6-digit verification code via SMS to <strong className="text-gray-700">{customerPhone}</strong> to confirm your booking request.
        </p>
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded inline-block">
          💡 For local testing, please check the server terminal logs to find the generated OTP code.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-xs border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {resendSuccess && (
        <div className="bg-green-50 text-green-700 p-3 rounded text-xs border border-green-100">
          ✓ Verification code resent successfully! Check server console log.
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4 max-w-xs mx-auto">
        <div>
          <label className="block text-center text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Enter 6-Digit OTP
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •"
            className="w-full text-center tracking-[0.5em] font-mono text-xl font-bold rounded-lg border border-gray-300 px-3 py-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || otp.length !== 6}
          className="w-full btn-primary"
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP & Submit Request'}
        </button>

        <div className="text-center">
          {resendTimer > 0 ? (
            <span className="text-xs text-gray-400">Resend code in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors"
            >
              {isResending ? 'Sending...' : 'Resend Verification Code'}
            </button>
          )}
        </div>
      </form>

      {/* Summary card */}
      <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-xs space-y-1.5 max-w-sm mx-auto">
        <div className="flex justify-between text-gray-400">
          <span>Booking Reference:</span>
          <span className="font-semibold text-gray-700 font-mono">{bookingNumber}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Estimated Billing:</span>
          <span className="font-semibold text-gray-700">Rs. {totalAmount}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Payment Mode:</span>
          <span className="font-semibold text-primary-700">Pay on Confirmation Call</span>
        </div>
      </div>
    </div>
  );
}
