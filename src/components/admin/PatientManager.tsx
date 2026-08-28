'use client';

import React, { useState } from 'react';
import { updatePatientBookingDetails } from '@/actions/admin';

export interface PatientRecord {
  bookingId: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  area: string;
  pincode: string;
  serviceName: string;
  serviceId: string;
  basePrice: number;
  totalAmount: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  medicalConditions: string;
  specialInstructions?: string;
  prescriptionUrl?: string;
  promoCode?: string;
  status: string;
  nurseName?: string | null;
  nursePhone?: string | null;
  createdAt: string;
}

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
}

interface PatientManagerProps {
  initialPatients: PatientRecord[];
  services: ServiceOption[];
}

export default function PatientManager({ initialPatients, services }: PatientManagerProps) {
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);

  // Edit Form State
  const [editPhone, setEditPhone] = useState('');
  const [editServiceId, setEditServiceId] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editArea, setEditArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter patients by name, phone, area, or booking number
  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.patientName?.toLowerCase().includes(q) ||
      p.customerName?.toLowerCase().includes(q) ||
      p.customerPhone?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) ||
      p.bookingNumber?.toLowerCase().includes(q) ||
      p.serviceName?.toLowerCase().includes(q)
    );
  });

  const handleStartEdit = (patient: PatientRecord) => {
    setEditingPatient(patient);
    setEditPhone(patient.customerPhone);
    setEditServiceId(patient.serviceId);
    setEditPrice(patient.totalAmount);
    setEditArea(patient.area || '');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setEditServiceId(sId);
    const found = services.find((s) => s.id === sId);
    if (found) {
      setEditPrice(found.basePrice);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updatePatientBookingDetails({
        bookingId: editingPatient.bookingId,
        customerPhone: editPhone.trim(),
        serviceId: editServiceId,
        totalAmount: Number(editPrice),
        area: editArea.trim(),
      });

      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Patient record updated successfully!');
        // Update local state
        const updatedService = services.find((s) => s.id === editServiceId);
        setPatients((prev) =>
          prev.map((p) =>
            p.bookingId === editingPatient.bookingId
              ? {
                  ...p,
                  customerPhone: editPhone.trim(),
                  serviceId: editServiceId,
                  serviceName: updatedService ? updatedService.name : p.serviceName,
                  totalAmount: Number(editPrice),
                  area: editArea.trim(),
                }
              : p
          )
        );
        setTimeout(() => {
          setEditingPatient(null);
          setSuccessMsg('');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients & Care Bookings CRM</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage patient records, adjust contact numbers, service allocations, and agreed pricing.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search name, phone, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Patient & Customer</th>
                <th className="p-4">Contact & Location</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Agreed Price</th>
                <th className="p-4">Clinical / Prescription</th>
                <th className="p-4">Assigned Nurse</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No patient records found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.bookingId} className="hover:bg-gray-50/50 transition-colors">
                    {/* Patient / Customer Name */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{patient.patientName}</div>
                      <div className="text-[11px] text-gray-500">
                        {patient.patientAge} Yrs • {patient.patientGender}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        Booked by: <span className="font-medium text-gray-600">{patient.customerName}</span>
                      </div>
                      <div className="text-[9px] font-mono text-gray-400">
                        #{patient.bookingNumber}
                      </div>
                    </td>

                    {/* Contact & Location */}
                    <td className="p-4">
                      <div className="font-mono font-semibold text-gray-800">{patient.customerPhone}</div>
                      <div className="text-gray-500 text-[11px] mt-0.5">{patient.area || 'Hyderabad'}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{patient.customerAddress}</div>
                    </td>

                    {/* Requested Service */}
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-md text-[11px] border border-purple-100">
                        {patient.serviceName}
                      </span>
                    </td>

                    {/* Agreed Price */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">
                        ₹{patient.totalAmount.toLocaleString('en-IN')}
                      </div>
                      {patient.promoCode && (
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200 block w-fit mt-1">
                          Promo: {patient.promoCode}
                        </span>
                      )}
                    </td>

                    {/* Clinical / Prescription */}
                    <td className="p-4 max-w-xs">
                      <div className="text-gray-700 text-[11px] font-medium line-clamp-2">
                        {patient.medicalConditions || 'No conditions specified'}
                      </div>
                      {patient.prescriptionUrl && (
                        <a
                          href={patient.prescriptionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-bold mt-1.5 underline"
                        >
                          📄 View Prescription
                        </a>
                      )}
                    </td>

                    {/* Assigned Nurse */}
                    <td className="p-4">
                      {patient.nurseName ? (
                        <div>
                          <div className="font-semibold text-emerald-700">👩‍⚕️ {patient.nurseName}</div>
                          <div className="font-mono text-[10px] text-gray-500">{patient.nursePhone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          patient.status === 'NURSE_ASSIGNED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : patient.status === 'CONFIRMED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>

                    {/* Edit Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleStartEdit(patient)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-xs transition-colors"
                      >
                        Edit Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Edit Patient Record: {editingPatient.patientName}
                </h3>
                <span className="text-xs text-gray-500 font-mono">Booking #{editingPatient.bookingNumber}</span>
              </div>
              <button
                onClick={() => setEditingPatient(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Phone Number */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer / Patient Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Required Nursing Service</label>
                <select
                  value={editServiceId}
                  onChange={handleServiceChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Standard: ₹{s.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Agreed Price */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Agreed Total Price (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Area / Locality */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  placeholder="e.g. Banjara Hills, Hyderabad"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Patient Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
