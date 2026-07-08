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
  const [serviceId, setServiceId] = useState('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [dateNeeded, setDateNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !serviceId || !dateNeeded) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createQuickBooking({
        name: name.trim(),
        phone: phone.trim(),
        serviceId,
        serviceNotes: serviceNotes.trim(),
        dateNeeded,
        message: message.trim(),
      });

      if (response.success && response.bookingId) {
        // Redirect to booking status page
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
    <div className="bg-slate-950/85 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-extrabold text-white text-center mb-5 tracking-tight uppercase">
        Book Now
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-500/30 text-red-200 text-xs rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            required
            disabled={loading}
          />
        </div>

        {/* Phone Input */}
        <div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            required
            disabled={loading}
          />
        </div>

        {/* Select a Service Dropdown */}
        <div>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            required
            disabled={loading}
          >
            <option value="" disabled className="text-slate-400">
              Select a Service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="text-slate-900">
                {s.name} (Rs. {Number(s.basePrice)}/{s.priceUnit})
              </option>
            ))}
          </select>
        </div>

        {/* Service Subtype details */}
        <div>
          <input
            type="text"
            value={serviceNotes}
            onChange={(e) => setServiceNotes(e.target.value)}
            placeholder="service"
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            disabled={loading}
          />
        </div>

        {/* Date of Service Needed */}
        <div>
          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 px-1">
            Date of Service Needed
          </label>
          <input
            type="date"
            value={dateNeeded}
            onChange={(e) => setDateNeeded(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            required
            disabled={loading}
          />
        </div>

        {/* Message Input */}
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full px-4 py-2.5 bg-white border border-transparent text-slate-900 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs font-medium"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-wider rounded-lg transition-colors shadow-lg active:scale-98 disabled:bg-slate-700 disabled:text-slate-400 cursor-pointer text-center"
            disabled={loading}
          >
            {loading ? 'submitting...' : 'submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
