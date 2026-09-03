'use client';

import React, { useState } from 'react';
import { submitPublicBooking, verifyBookingOtp, resendBookingOtp } from '@/actions/booking';
import Link from 'next/link';
import Image from 'next/image';
import ModernPaymentSection from './ModernPaymentSection';

export interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  priceUnit: string;
}

interface TwoStepBookingFormProps {
  services: ServiceOption[];
}

// Popular Hyderabad Service Localities
const HYDERABAD_AREAS = [
  'Banjara Hills',
  'Jubilee Hills',
  'Gachibowli',
  'Madhapur / Hitech City',
  'Kondapur',
  'Kukatpally',
  'Secunderabad',
  'Begumpet',
  'Ameerpet',
  'SR Nagar',
  'Dilsukhnagar',
  'Uppal',
  'Miyapur',
  'Mehdipatnam',
  'Other / Custom Locality',
];

export default function TwoStepBookingForm({ services }: TwoStepBookingFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedArea, setSelectedArea] = useState(HYDERABAD_AREAS[0]);
  const [customArea, setCustomArea] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    services[0]?.id || ''
  );
  const [message, setMessage] = useState('');

  // Step 2 State
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountApplied, setPromoDiscountApplied] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'PAY_NOW' | 'PAY_AFTER'>('PAY_NOW');
  const [utrNumber, setUtrNumber] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Submission & UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [bookingOtp, setBookingOtp] = useState('');
  const [bookingVerified, setBookingVerified] = useState(false);

  // Selected Service Price Computation
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const rawPrice = currentService ? Number(currentService.basePrice) : 1000;
  const finalPrice = promoDiscountApplied ? Math.round(rawPrice * 0.9) : rawPrice;

  // Handle Step 1 Validation & Transition
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!selectedServiceId) {
      setError('Please select a nursing care service.');
      return;
    }

    setStep(2);
  };

  // Handle Promo Code Apply
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WITHU10') {
      setPromoDiscountApplied(true);
      setError(null);
    } else {
      setError('Invalid Promo Code. Try "WITHU10" for 10% off.');
      setPromoDiscountApplied(false);
    }
  };

  // Final Form Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!consentGiven) {
      setError('Please provide consent before submitting your booking.');
      setLoading(false);
      return;
    }

    const activeArea = selectedArea === 'Other / Custom Locality' ? (customArea.trim() || 'Hyderabad') : selectedArea;

    try {
      const res = await submitPublicBooking({
        name: name.trim(),
        phone: phone.trim(),
        area: activeArea,
        serviceId: selectedServiceId,
        message: message.trim(),
        promoCode: promoDiscountApplied ? 'WITHU10' : promoCode.trim() || undefined,
        paymentMode,
        utrNumber: utrNumber.trim() || undefined,
        consentGiven: true,
      });

      if (res.success) {
        setSubmittedBooking(res);
      } else {
        setError(res.error || 'Failed to complete booking. Please try again.');
      }
    } catch (err: any) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (submittedBooking) {
    const verifySubmittedBooking = async () => {
      setError(null);
      const result = await verifyBookingOtp(submittedBooking.bookingId, bookingOtp);
      if (result.success) {
        setBookingVerified(true);
        setError(null);
      } else {
        setError(result.error || 'Unable to verify your booking.');
      }
    };

    const handleResendOtp = async () => {
      setError(null);
      const result = await resendBookingOtp(submittedBooking.bookingId);
      if (result.success) {
        setError(null);
      } else {
        setError(result.error || 'Failed to resend verification code.');
      }
    };

    return (
      <div className="bg-slate-950/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 w-full max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/30">
          ✓
        </div>

        <div>
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-1">
            Booking Received • Assigned to Operations
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Thank You, {submittedBooking.customerName}!
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Your request for <strong className="text-white">{submittedBooking.serviceName}</strong> has been logged under reference:
          </p>
          <div className="mt-3 inline-block px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-sm font-bold text-purple-400">
            #{submittedBooking.bookingNumber}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 text-left text-xs space-y-2 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500">Contact Number:</span>
            <span className="font-mono text-white">{submittedBooking.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Amount:</span>
            <span className="font-bold text-emerald-400">₹{submittedBooking.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Lead Status:</span>
            <span className="text-emerald-400 font-semibold">
              {submittedBooking.requiresVerification && !bookingVerified
                ? 'Pending Phone Verification'
                : 'Queued for Nurse Dispatch'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-xl text-left">
            ⚠️ {error}
          </div>
        )}

        {submittedBooking.requiresVerification && !bookingVerified ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Please enter the 6-digit verification code sent to your phone:
            </p>
            <div className="flex gap-2">
              <input
                value={bookingOtp}
                onChange={(e) => setBookingOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-center font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={verifySubmittedBooking}
                disabled={bookingOtp.length !== 6}
                className="rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50 cursor-pointer"
              >
                Verify
              </button>
            </div>
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[11px] text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Resend verification code
            </button>
          </div>
        ) : (
          <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs text-slate-300">
            Our nursing care coordinator will call you at <strong className="text-white">{submittedBooking.customerPhone}</strong> within 15 minutes to confirm nurse availability and schedule your visit.
          </div>
        )}

        <div className="pt-2">
          <Link
            href="/"
            className="inline-block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 w-full max-w-lg mx-auto text-slate-100">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {step === 1 ? 'Step 1: Patient & Service Details' : 'Step 2: Prescription & Payment'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {step === 1 ? 'Select nursing care and enter contact information' : 'Confirm your request and unlock instant discount'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              step === 1 ? 'bg-purple-600 text-white' : 'bg-emerald-500 text-slate-950'
            }`}
          >
            1
          </span>
          <span className="text-slate-600">─</span>
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              step === 2 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Name, Mobile, Area, Scrollable Services, Message */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Patient / Care Seeker Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-purple-500 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-medium placeholder:text-slate-500"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Mobile Number (10 Digits) *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 bg-slate-900 border border-r-0 border-slate-800 text-slate-400 text-xs rounded-l-xl font-mono">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-purple-500 text-white rounded-r-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-mono placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Area / Locality Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Area / Locality in Hyderabad *
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-purple-500 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-medium"
            >
              {HYDERABAD_AREAS.map((area) => (
                <option key={area} value={area} className="bg-slate-900 text-white">
                  {area}
                </option>
              ))}
            </select>

            {selectedArea === 'Other / Custom Locality' && (
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="Type your locality or landmark..."
                className="mt-2 w-full px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          {/* Scrollable Services List with Amounts */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Nursing Service *
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-800/80 rounded-2xl p-2 bg-slate-900/40">
              {services.map((s) => {
                const isSelected = selectedServiceId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-purple-400 bg-purple-600' : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{s.name}</div>
                        {s.description && (
                          <div className="text-[10px] text-slate-400 line-clamp-1">{s.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-emerald-400 text-xs">
                        ₹{Number(s.basePrice).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] text-slate-500">per {s.priceUnit}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Box (Free Text) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Special Care Instructions / Message (Optional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Patient needs tracheostomy suctioning & sugar monitoring..."
              className="w-full px-4 py-2 bg-slate-900 border border-slate-800 focus:border-purple-500 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs placeholder:text-slate-500"
            />
          </div>

          {/* Step 1 Next Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Next: Prescription & Payment</span>
              <span>→</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Prescription upload, UPI QR Code, Discount Copy, Promo Code, Submit */}
      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-5">
          {/* Summary Banner */}
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-white/5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Selected Package:</span>
              <strong className="text-white font-bold">{currentService?.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Rate:</span>
              <strong className="font-mono text-emerald-400 font-bold text-sm">
                ₹{finalPrice.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Prescription Upload Prompt */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Prescription Sharing (Optional / Doctor Note)
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 text-center bg-slate-900/30 transition-colors">
              <input
                type="file"
                id="prescription-file"
                accept="image/*,.pdf"
                disabled
                className="hidden"
              />
              <label htmlFor="prescription-file" className="cursor-pointer block">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                  Prescription uploads are temporarily unavailable
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPG accepted (up to 10MB)</div>
              </label>
            </div>
          </div>

          {/* Modern Interactive UPI & Doorstep Payment Section */}
          <ModernPaymentSection
            finalPrice={finalPrice}
            serviceName={currentService?.name || 'Nursing Service'}
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
            utrNumber={utrNumber}
            onUtrChange={setUtrNumber}
          />

          <label className="flex gap-3 items-start rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-xs text-slate-300">
            <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mt-0.5 h-4 w-4" />
            <span>I consent to processing the details in this request to arrange nursing care. Prescription uploads are temporarily unavailable while secure storage is being completed.</span>
          </label>

          {/* Promo Code Entry Box */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. WITHU10)"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-purple-500 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-mono uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
            {promoDiscountApplied && (
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                ✓ Promo applied: 10% discount subtracted from total amount!
              </span>
            )}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase rounded-xl transition-colors border border-slate-800"
              disabled={loading}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer text-center flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Submitting & Notifying Admin...</span>
              ) : (
                <span>Submit & Confirm Booking ✓</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
