'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingDetailsSchema, type BookingDetailsInput } from '@/lib/validations/booking';
import { createBookingRecord } from '@/actions/booking';
import { useRouter } from 'next/navigation';

interface BookingDetailsFormProps {
  serviceId: string;
  serviceName: string;
  basePrice: number;
  priceUnit: string;
  minimumDays: number;
}

export default function BookingDetailsForm({
  serviceId,
  serviceName,
  basePrice,
  priceUnit,
  minimumDays,
}: BookingDetailsFormProps) {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingDetailsInput>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: {
      serviceId,
      consentGiven: true,
      shiftType: 'DAY_12HR',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Recalculate price dynamically when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setCalculatedDays(days);
        setCalculatedPrice(days * basePrice);
      } else {
        setCalculatedDays(0);
        setCalculatedPrice(0);
      }
    } else {
      setCalculatedDays(0);
      setCalculatedPrice(0);
    }
  }, [startDate, endDate, basePrice]);

  const onSubmit = async (data: BookingDetailsInput) => {
    setIsSubmitting(true);
    setGlobalError(null);

    const response = await createBookingRecord(data);

    if (response.success && response.bookingId) {
      // Go to confirmation step
      router.push(`/booking/confirm?bookingId=${response.bookingId}`);
    } else {
      setIsSubmitting(false);
      if (response.globalError) {
        setGlobalError(response.globalError);
      } else if (response.error) {
        // Fallback for field errors
        setGlobalError('Please verify all details are filled in correctly.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      {globalError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-100">
          ⚠️ {globalError}
        </div>
      )}

      {/* Selected Service Card */}
      <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-semibold text-gray-400">Selected Service</span>
          <h3 className="font-bold text-gray-950 text-base">{serviceName}</h3>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-primary-700 block">Rs. {basePrice}/{priceUnit}</span>
          <span className="text-xs text-gray-400">Min: {minimumDays} {priceUnit}(s)</span>
        </div>
      </div>

      <input type="hidden" {...register('serviceId')} />

      {/* 1. Schedule Details */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">1. Schedule Durations</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
              {register('startDate')}
            />
            {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              className={`input-field ${errors.endDate ? 'border-red-500' : ''}`}
              min={startDate || new Date().toISOString().split('T')[0]}
              {register('endDate')}
            />
            {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Shift Duration</label>
            <select
              className={`input-field ${errors.shiftType ? 'border-red-500' : ''}`}
              {register('shiftType')}
            >
              <option value="DAY_12HR">12-Hour Shift (Day)</option>
              <option value="NIGHT_12HR">12-Hour Shift (Night)</option>
              <option value="FULL_24HR">24-Hour Dedicated (Live-In)</option>
              <option value="HOURLY">Hourly Visit (1-2 Hrs)</option>
            </select>
            {errors.shiftType && <p className="text-xs text-red-600 mt-1">{errors.shiftType.message}</p>}
          </div>
        </div>
      </div>

      {/* 2. Customer Contact & Location */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">2. Contact & Address (Hyderabad Only)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Customer Full Name</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              className={`input-field ${errors.customerName ? 'border-red-500' : ''}`}
              {register('customerName')}
            />
            {errors.customerName && <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">10-Digit Mobile Number (OTP required)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm text-gray-400 font-semibold pointer-events-none">+91</span>
              <input
                type="tel"
                placeholder="9876543210"
                className={`input-field pl-12 ${errors.customerPhone ? 'border-red-500' : ''}`}
                {register('customerPhone')}
              />
            </div>
            {errors.customerPhone && <p className="text-xs text-red-600 mt-1">{errors.customerPhone.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">House No. / Flat, Street Address</label>
            <input
              type="text"
              placeholder="Flat 304, Green Meadows, Lingampally"
              className={`input-field ${errors.addressLine1 ? 'border-red-500' : ''}`}
              {register('addressLine1')}
            />
            {errors.addressLine1 && <p className="text-xs text-red-600 mt-1">{errors.addressLine1.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Landmark / Locality (Optional)</label>
            <input
              type="text"
              placeholder="Near Lingampally Railway Station"
              className="input-field"
              {register('addressLine2')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pincode (Hyderabad Service Area)</label>
            <input
              type="text"
              placeholder="500019"
              maxLength={6}
              className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
              {register('pincode')}
            />
            {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode.message}</p>}
          </div>
        </div>
      </div>

      {/* 3. Patient Details (Clinical PHI - Encrypted at Rest) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-3">3. Patient Profile</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Patient Name</label>
            <input
              type="text"
              placeholder="Patient Name"
              className={`input-field ${errors.patientName ? 'border-red-500' : ''}`}
              {register('patientName')}
            />
            {errors.patientName && <p className="text-xs text-red-600 mt-1">{errors.patientName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Patient Age</label>
            <input
              type="number"
              placeholder="Age"
              className={`input-field ${errors.patientAge ? 'border-red-500' : ''}`}
              {register('patientAge')}
            />
            {errors.patientAge && <p className="text-xs text-red-600 mt-1">{errors.patientAge.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Patient Gender</label>
            <select
              className={`input-field ${errors.patientGender ? 'border-red-500' : ''}`}
              {register('patientGender')}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.patientGender && <p className="text-xs text-red-600 mt-1">{errors.patientGender.message}</p>}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Medical Conditions / Reasons for Care</label>
            <textarea
              rows={3}
              placeholder="Provide a brief summary of medical history, prescriptions, post-operative wounds, mobility status, or critical requirements."
              className={`input-field h-20 resize-none ${errors.medicalConditions ? 'border-red-500' : ''}`}
              {register('medicalConditions')}
            />
            {errors.medicalConditions && <p className="text-xs text-red-600 mt-1">{errors.medicalConditions.message}</p>}
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Special Instructions for Nurse (Optional)</label>
            <input
              type="text"
              placeholder="e.g. IV drip setup available, nurse must speak Telugu"
              className="input-field"
              {register('specialInstructions')}
            />
          </div>
        </div>
      </div>

      {/* 4. DPDP Consent & Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        {calculatedDays > 0 && (
          <div className="flex justify-between items-center text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
            <span>Duration: {calculatedDays} days</span>
            <span className="text-primary-700">Estimated Total: Rs. {calculatedPrice}</span>
          </div>
        )}

        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="consentGiven"
            className="w-4 h-4 rounded text-primary-600 border-gray-300 focus:ring-primary-500 mt-0.5"
            {register('consentGiven')}
          />
          <label htmlFor="consentGiven" className="text-xs text-gray-500 leading-normal">
            I explicitly consent to Neetha Nursing Service processing my contact details and the patient's medical history to coordinate at-home care. I understand this clinical data will be stored securely and processed in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
          </label>
        </div>
        {errors.consentGiven && <p className="text-xs text-red-600 font-semibold">{errors.consentGiven.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Details & Send OTP →'}
        </button>
      </div>
    </form>
  );
}
