'use client';

import React, { useState } from 'react';
import { submitJobClaim, employeeLogout } from '@/actions/employee';
import { useRouter } from 'next/navigation';

interface OpenJob {
  id: string;
  bookingNumber: string;
  serviceName: string;
  basePrice: number;
  totalAmount: number;
  totalDays: number;
  shiftType: string;
  startDate: string;
  endDate: string;
  area: string;
  patientGender: string;
  patientAge: number;
  myClaim: {
    id: string;
    proposedPrice: number;
    proposedArea: string;
    proposedTime: string;
    status: string;
  } | null;
}

interface AssignedJob {
  id: string;
  bookingNumber: string;
  serviceName: string;
  totalAmount: number;
  totalDays: number;
  shiftType: string;
  startDate: string;
  endDate: string;
  status: string;
  area: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  medicalConditions: string;
  specialInstructions: string | null;
  prescriptionUrl: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

interface JobBoardProps {
  employee: {
    id: string;
    name: string;
    phone: string;
    qualification: string;
    baseLocation: string | null;
  };
  openJobs: OpenJob[];
  assignedJobs: AssignedJob[];
}

export default function JobBoard({ employee, openJobs, assignedJobs }: JobBoardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'OPEN' | 'ASSIGNED'>('OPEN');
  const [selectedJob, setSelectedJob] = useState<OpenJob | null>(null);

  // Claim Modal inputs
  const [proposedPrice, setProposedPrice] = useState<number>(0);
  const [proposedArea, setProposedArea] = useState(employee.baseLocation || 'Lingampally, Hyderabad');
  const [proposedTime, setProposedTime] = useState('09:00 AM - 09:00 PM');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const handleOpenClaimModal = (job: OpenJob) => {
    setSelectedJob(job);
    setProposedPrice(job.myClaim ? job.myClaim.proposedPrice : job.totalAmount);
    setProposedArea(job.myClaim ? job.myClaim.proposedArea : (employee.baseLocation || job.area));
    setProposedTime(job.myClaim ? job.myClaim.proposedTime : '09:00 AM - 09:00 PM');
    setNotes('');
    setClaimError(null);
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    setClaimError(null);

    const res = await submitJobClaim({
      bookingId: selectedJob.id,
      proposedPrice: Number(proposedPrice),
      proposedArea: proposedArea.trim(),
      proposedTime: proposedTime.trim(),
      notes: notes.trim(),
    });

    setSubmitting(false);

    if (res.error) {
      setClaimError(res.error);
    } else {
      setSelectedJob(null);
      router.refresh();
    }
  };

  const handleSignOut = async () => {
    await employeeLogout();
    router.push('/employee/login');
  };

  // Helper for generating WhatsApp deep link to message patient
  const generateWhatsAppLink = (job: AssignedJob) => {
    const cleanPhone = job.customerPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const startFormatted = new Date(job.startDate).toLocaleDateString();

    const message = `Hello ${job.customerName}, I am ${employee.name} from Neetha Nursing Service (WithU Care). I have been assigned to assist ${job.patientName} with ${job.serviceName} starting on ${startFormatted}. Please let me know your preferred arrival time and if you have any questions.`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-black text-sm">
              {employee.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{employee.name}</h1>
              <p className="text-xs text-slate-400">
                {employee.qualification} • {employee.baseLocation || 'Hyderabad'} • {employee.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('OPEN')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'OPEN'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Open Jobs ({openJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('ASSIGNED')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'ASSIGNED'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Bookings ({assignedJobs.length})
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* TAB 1: Open Jobs Feed */}
      {activeTab === 'OPEN' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Available Care Opportunities
            </h2>
            <span className="text-xs text-slate-500">
              Submit your proposed price, service area, and time for admin approval.
            </span>
          </div>

          {openJobs.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 text-xs">
              🎉 No open requests available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {openJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-primary-400 uppercase tracking-wider block">
                          {job.bookingNumber}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{job.serviceName}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        ₹{job.totalAmount}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Area</span>
                        <span className="text-slate-200 font-medium">{job.area}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Schedule</span>
                        <span className="text-slate-200 font-medium">
                          {new Date(job.startDate).toLocaleDateString()} ({job.shiftType})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Patient</span>
                        <span className="text-slate-200 font-medium">
                          {job.patientGender}, {job.patientAge} Years
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Duration</span>
                        <span className="text-slate-200 font-medium">{job.totalDays} Day(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    {job.myClaim ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            job.myClaim.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-950/60 border-amber-500/30 text-amber-300'
                              : job.myClaim.status === 'APPROVED'
                              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                              : 'bg-red-950/60 border-red-500/30 text-red-300'
                          }`}
                        >
                          {job.myClaim.status === 'PENDING_APPROVAL'
                            ? '⏳ Proposal Pending Approval'
                            : job.myClaim.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          (Bid: ₹{job.myClaim.proposedPrice})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Open for bids</span>
                    )}

                    <button
                      onClick={() => handleOpenClaimModal(job)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      {job.myClaim ? 'Update Proposal' : 'Claim / Bid Job →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Assigned Jobs (Patient Reveal & Book Now WhatsApp) */}
      {activeTab === 'ASSIGNED' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              My Approved & Assigned Bookings
            </h2>
            <span className="text-xs text-emerald-400 font-semibold">
              🔒 Patient Details Revealed Upon Approval
            </span>
          </div>

          {assignedJobs.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 text-xs">
              📋 You have no active assignments yet. Claim open jobs to get assigned!
            </div>
          ) : (
            <div className="space-y-4">
              {assignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary-400 uppercase">
                          {job.bookingNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          ✓ APPROVED & ASSIGNED
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{job.serviceName}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-white block">₹{job.totalAmount}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(job.startDate).toLocaleDateString()} ({job.shiftType})
                      </span>
                    </div>
                  </div>

                  {/* Revealed Patient & Customer Details */}
                  <div className="grid gap-4 sm:grid-cols-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Patient Profile
                      </span>
                      <p className="text-slate-200">
                        Name: <strong className="text-white">{job.patientName}</strong> ({job.patientAge} Yrs / {job.patientGender})
                      </p>
                      <p className="text-slate-300">
                        Conditions: <span className="text-slate-400">{job.medicalConditions}</span>
                      </p>
                      {job.specialInstructions && (
                        <p className="text-slate-300">
                          Instructions: <span className="text-slate-400">{job.specialInstructions}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Coordinator / Family Contact
                      </span>
                      <p className="text-slate-200">
                        Contact Person: <strong className="text-white">{job.customerName}</strong>
                      </p>
                      <p className="text-slate-200">
                        Phone: <strong className="text-emerald-400 font-mono">{job.customerPhone}</strong>
                      </p>
                      <p className="text-slate-300">
                        Address: <span className="text-slate-400">{job.customerAddress}</span>
                      </p>
                    </div>
                  </div>

                  {/* Flow 1: Action Button: Book Now via WhatsApp */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                    <span className="text-xs text-slate-400">
                      Click below to open WhatsApp with prefilled patient & service details from your phone.
                    </span>

                    <a
                      href={generateWhatsAppLink(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💬</span>
                      <span>Book Now (WhatsApp Patient)</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim / Bid Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-primary-400 uppercase font-bold">
                  {selectedJob.bookingNumber}
                </span>
                <h3 className="text-base font-bold text-white">
                  Submit Proposal: {selectedJob.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {claimError && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl">
                ⚠️ {claimError}
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Proposed Price (INR ₹)
                </label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  required
                  min={1}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Original base amount: ₹{selectedJob.totalAmount}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Service Area / Coverage
                </label>
                <input
                  type="text"
                  value={proposedArea}
                  onChange={(e) => setProposedArea(e.target.value)}
                  required
                  placeholder="e.g. Lingampally, Kondapur, Hyderabad"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Proposed Time Slot / Availability
                </label>
                <input
                  type="text"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  required
                  placeholder="e.g. 08:00 AM - 08:00 PM or Immediate"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Additional Notes for Administrator (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 5+ years experience in ICU wound care, available immediately."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Send to Admin for Approval →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
