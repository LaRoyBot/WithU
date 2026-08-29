'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuickBooking } from '@/actions/booking';

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  priceUnit: string;
}

interface QuickBookingFormProps {
  services: ServiceOption[];
}

export default function QuickBookingForm({ services }: QuickBookingFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [customService, setCustomService] = useState('');
  const [dateNeeded, setDateNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Name, Phone Number, and Area are mandatory
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!area.trim()) {
      setError('Please enter your area / locality.');
      return;
    }

    // Basic phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createQuickBooking({
        name: name.trim(),
        phone: phone.trim(),
        area: area.trim(),
        serviceId: serviceId && serviceId !== 'other' ? serviceId : undefined,
        customService: serviceId === 'other' ? customService.trim() : undefined,
        dateNeeded: dateNeeded || undefined,
        message: message.trim() || undefined,
      });

      if (response.success && response.bookingId) {
        // Redirect to booking status / confirmation page
        router.push(`/booking/status?id=${response.bookingId}`);
      } else {
        setError(response.error || 'Failed to submit booking. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#242938] rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/5 w-full max-w-[390px] mx-auto text-white">
      <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-4 tracking-tight uppercase">
        BOOK NOW
      </h2>

      {error && (
        <div className="mb-3 p-2.5 bg-red-900/50 border border-red-500/40 text-red-200 text-xs rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* 1. Your Name (Mandatory) */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-shadow"
            required
            disabled={loading}
          />
        </div>

        {/* 2. Phone Number (Mandatory) */}
        <div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-shadow"
            required
            disabled={loading}
          />
        </div>

        {/* 3. Area (Mandatory) */}
        <div>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area / Locality (e.g. Banjara Hills, Miyapur)"
            className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-shadow"
            required
            disabled={loading}
          />
        </div>

        {/* 4. Select a Service Dropdown (Optional) */}
        <div>
          <select
            value={serviceId}
            onChange={(e) => {
              setServiceId(e.target.value);
              if (e.target.value !== 'other') {
                setCustomService('');
              }
            }}
            className="w-full px-3.5 py-2.5 bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium cursor-pointer transition-shadow"
            disabled={loading}
          >
            <option value="" className="text-slate-400">
              Select a Service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-900">
                {s.name} (₹{Number(s.basePrice)}/{s.priceUnit})
              </option>
            ))}
            <option value="other" className="text-slate-900 font-semibold">
              Other
            </option>
          </select>
        </div>

        {/* 5. Conditional Free-fill Service Box (Pops up when 'other' is selected) */}
        {serviceId === 'other' && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              placeholder="service"
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-shadow"
              disabled={loading}
              autoFocus
            />
          </div>
        )}

        {/* 6. Date of Service Needed (Optional) */}
        <div>
          <label className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider mb-1 px-0.5">
            DATE OF SERVICE NEEDED
          </label>
          <input
            type="date"
            value={dateNeeded}
            onChange={(e) => setDateNeeded(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white text-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium cursor-pointer transition-shadow"
            disabled={loading}
          />
        </div>

        {/* 7. Message (Optional) */}
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition-shadow"
            disabled={loading}
          />
        </div>

        {/* 8. Submit Button */}
        <div className="pt-1.5">
          <button
            type="submit"
            className="w-full py-3 bg-[#FF6A13] hover:bg-[#E85B07] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-orange-500/25 disabled:bg-slate-700 disabled:text-slate-400 cursor-pointer text-center"
            disabled={loading}
          >
            {loading ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </div>
      </form>
    </div>
  );
}
