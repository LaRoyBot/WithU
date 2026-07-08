'use client';

import React, { useState } from 'react';
import { updateBookingStatus, assignNurse } from '@/actions/admin';

interface DecryptedBooking {
  id: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
  shiftType: string;
  totalDays: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  medicalConditions: string;
  specialInstructions: string | null;
  customer: {
    name: string;
    phone: string;
    addressLine1: string;
    pincode: string;
  };
  service: {
    name: string;
  };
  nurse: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

interface NurseOption {
  id: string;
  name: string;
  phone: string;
  skills: string;
}

interface BookingsQueueProps {
  initialBookings: DecryptedBooking[];
  activeNurses: NurseOption[];
}

export default function BookingsQueue({ initialBookings, activeNurses }: BookingsQueueProps) {
  const [selectedBooking, setSelectedBooking] = useState<DecryptedBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState(false);
  const [assignNurseId, setAssignNurseId] = useState('');

  const filteredBookings = initialBookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const handleStatusUpdate = async (bookingId: string, toStatus: string, notes?: string) => {
    if (!window.confirm(`Are you sure you want to change status to: ${toStatus}?`)) return;
    setActionLoading(true);
    const res = await updateBookingStatus(bookingId, toStatus, notes);
    setActionLoading(false);
    if (res.error) {
      alert(res.error);
    } else {
      setSelectedBooking(null);
    }
  };

  const handleAssignNurse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !assignNurseId) return;

    setActionLoading(true);
    const res = await assignNurse(selectedBooking.id, assignNurseId);
    setActionLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      setAssignNurseId('');
      setSelectedBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Care Bookings Queue</h1>
          <p className="text-xs text-gray-500 mt-1">Review, match caregiver resources, and coordinate at-home care schedules.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-400 uppercase">Filter Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs focus:ring-primary-500 focus:outline-none"
          >
            <option value="ALL">All Active Requests</option>
            <option value="CONFIRMED">Awaiting Nurse (Confirmed)</option>
            <option value="NURSE_ASSIGNED">Nurse Allocated</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Queue Grid/Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            📭 No bookings match the selected status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">Ref / Created</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Care Service</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Schedule Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono">
                      <span className="font-bold text-gray-900 block">{booking.bookingNumber}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900 block">{booking.customer.name}</span>
                      <span className="text-gray-400 block mt-0.5">{booking.customer.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900 block">{booking.service.name}</span>
                      <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-1.5 py-0.5 rounded border border-primary-100 inline-block mt-1">
                        Rs. {booking.totalAmount}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {booking.patientName}
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="block">{booking.totalDays} Days ({booking.shiftType})</span>
                      <span className="text-[10px] block mt-0.5">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : booking.status === 'NURSE_ASSIGNED'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : booking.status === 'IN_PROGRESS'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : booking.status === 'COMPLETED'
                            ? 'bg-gray-100 text-gray-700 border-gray-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-3 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 text-[11px] font-bold rounded transition-colors"
                      >
                        View & Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 font-mono">{selectedBooking.bookingNumber}</span>
                  <h2 className="text-lg font-bold text-gray-900">Manage Booking Request</h2>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Status Section */}
              <div className="mb-6 bg-gray-50 border border-gray-100 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Current Status</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedBooking.status}</span>
                </div>
                <div className="flex gap-2">
                  {selectedBooking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED', 'Cancelled by coordinator')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-semibold"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {selectedBooking.status === 'NURSE_ASSIGNED' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'IN_PROGRESS', 'Nurse checked-in at patient home')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold"
                    >
                      Start Care
                    </button>
                  )}
                  {selectedBooking.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'COMPLETED', 'Completed nursing plan of care')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-semibold"
                    >
                      Complete Booking
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Care Details (PHI - Decrypted) */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">1. Patient Profile</h4>
                  <div className="bg-gray-50/50 p-3 rounded border border-gray-100 text-xs space-y-1.5 text-gray-700">
                    <div>Patient Name: <strong className="text-gray-900">{selectedBooking.patientName}</strong></div>
                    <div>Age & Gender: {selectedBooking.patientAge} Years / {selectedBooking.patientGender}</div>
                    <div className="pt-1.5 border-t border-gray-100 text-gray-900 font-medium">Medical Conditions:</div>
                    <p className="text-gray-500 whitespace-pre-wrap leading-relaxed">{selectedBooking.medicalConditions}</p>
                    {selectedBooking.specialInstructions && (
                      <>
                        <div className="pt-1.5 border-t border-gray-100 text-gray-900 font-medium">Special Instructions:</div>
                        <p className="text-gray-500 whitespace-pre-wrap leading-relaxed">{selectedBooking.specialInstructions}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">2. Coordinator Contact & Address</h4>
                  <div className="bg-gray-50/50 p-3 rounded border border-gray-100 text-xs space-y-1 text-gray-700">
                    <div>Contact: <strong className="text-gray-900">{selectedBooking.customer.name}</strong> ({selectedBooking.customer.phone})</div>
                    <div>Address: {selectedBooking.customer.addressLine1}</div>
                    <div>Pincode: {selectedBooking.customer.pincode} (Hyderabad Area)</div>
                  </div>
                </div>

                {/* Allocated Nurse details */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">3. Assigned Nurse</h4>
                  {selectedBooking.nurse ? (
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded text-xs flex justify-between items-center text-indigo-900">
                      <div>
                        <div className="font-bold">{selectedBooking.nurse.name}</div>
                        <div className="text-[10px] text-indigo-700">{selectedBooking.nurse.phone}</div>
                      </div>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED', 'Nurse unallocated by admin coordinator')}
                        className="text-[10px] font-bold text-red-600 hover:underline"
                      >
                        Unassign Nurse
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No nurse caregiver assigned yet.</p>
                  )}
                </div>
              </div>

              {/* Roster Assignment Tool */}
              {!selectedBooking.nurse && selectedBooking.status === 'CONFIRMED' && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">Allocate Caregiver Resource</h4>
                  <form onSubmit={handleAssignNurse} className="flex gap-2">
                    <select
                      value={assignNurseId}
                      onChange={(e) => setAssignNurseId(e.target.value)}
                      className="flex-1 rounded border border-gray-300 px-3 py-2 text-xs focus:ring-primary-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Choose Nurse from Roster --</option>
                      {activeNurses.map((nurse) => (
                        <option key={nurse.id} value={nurse.id}>
                          {nurse.name} (Exp: {nurse.skills})
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={actionLoading || !assignNurseId}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-full text-center py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
