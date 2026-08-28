'use client';

import React, { useState } from 'react';
import { submitPublicBooking } from '@/actions/booking';
import Link from 'next/link';

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
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [prescriptionName, setPrescriptionName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountApplied, setPromoDiscountApplied] = useState(false);

  // Submission & UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);

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

  // Mock File Upload (Prescription)
  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionName(file.name);
      // In production, upload to S3/Cloudinary/Blob; here we store a verifiable mock data URL
      const mockBlobUrl = `https://storage.neethacare.in/prescriptions/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      setPrescriptionUrl(mockBlobUrl);
    }
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

    const activeArea = selectedArea === 'Other / Custom Locality' ? (customArea.trim() || 'Hyderabad') : selectedArea;

    try {
      const res = await submitPublicBooking({
        name: name.trim(),
        phone: phone.trim(),
        area: activeArea,
        serviceId: selectedServiceId,
        message: message.trim(),
        prescriptionUrl: prescriptionUrl || undefined,
        promoCode: promoDiscountApplied ? 'WITHU10' : promoCode.trim() || undefined,
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
    return (
      <div className="bg-slate-950/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 w-full max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-emerald-500/30">
          ✓
        </div>

        <div>
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold block mb-1">
            Booking Received • Assigned to Admin
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
            <span className="text-slate-500">Dispatch Notification:</span>
            <span className="text-emerald-400 font-semibold">Sent to Admin WhatsApp</span>
          </div>
        </div>

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
                onChange={handlePrescriptionUpload}
                className="hidden"
              />
              <label htmlFor="prescription-file" className="cursor-pointer block">
                <div className="text-2xl mb-1">📄</div>
                <div className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                  {prescriptionName ? `Selected: ${prescriptionName}` : 'Click to Upload Prescription / Medical File'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPG accepted (up to 10MB)</div>
              </label>
            </div>
          </div>

          {/* Payment QR Code & Copy */}
          <div className="bg-gradient-to-br from-slate-900 to-purple-950/40 rounded-2xl p-4 border border-purple-900/30 text-center space-y-3">
            <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Scan & Pay with any UPI App
            </div>

            {/* Simulated UPI QR Code SVG */}
            <div className="bg-white p-3 rounded-xl w-32 h-32 mx-auto shadow-md flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0 0h30v30H0V0zm6 6h18v18H6V6zm70-6h30v30H76V0zm6 6h18v18H82V6zM0 70h30v30H0V70zm6 6h18v18H6V76zm40-70h8v8h-8V6zm14 0h8v8h-8V6zm-14 14h8v8h-8v-8zm14 0h8v8h-8v-8zm-28 20h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8zm-42 14h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8zm-42 14h8v8h-8v-8zm14 0h8v8h-8v-8zm28 0h8v8h-8v-8zm-28 14h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v8h-8v-8z" />
              </svg>
            </div>

            <p className="text-xs font-black text-amber-300 tracking-wide">
              "To avail discount, please make payment"
            </p>
            <div className="text-[10px] font-mono text-slate-400">UPI ID: withu.healthcare@icici</div>
          </div>

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
