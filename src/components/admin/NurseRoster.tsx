'use client';

import React, { useState } from 'react';
import { upsertNurseRoster, toggleNurseApproval, deleteNurseProfile } from '@/actions/admin';

interface NurseProfile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  gender: string;
  qualification: string;
  experienceYears: number;
  skills: string;
  baseLocation: string | null;
  panNumber: string | null;
  aadharName: string | null;
  certificationDocUrl: string | null;
  isApproved: boolean;
  status: string;
}

interface NurseRosterProps {
  nurses: NurseProfile[];
}

export default function NurseRoster({ nurses }: NurseRosterProps) {
  const [editingNurse, setEditingNurse] = useState<NurseProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<{ name: string; url: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Female');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [skills, setSkills] = useState('');
  const [baseLocation, setBaseLocation] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharName, setAadharName] = useState('');
  const [certificationDocUrl, setCertificationDocUrl] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [status, setStatus] = useState('ACTIVE');

  const openCreateForm = () => {
    setEditingNurse(null);
    setName('');
    setPhone('+91');
    setEmail('');
    setPassword('');
    setGender('Female');
    setQualification('GNM (General Nursing)');
    setExperienceYears(2);
    setSkills('wound_dressing, injections');
    setBaseLocation('Lingampally, Hyderabad');
    setPanNumber('');
    setAadharName('');
    setCertificationDocUrl('');
    setIsApproved(true);
    setStatus('ACTIVE');
    setIsFormOpen(true);
  };

  const openEditForm = (nurse: NurseProfile) => {
    setEditingNurse(nurse);
    setName(nurse.name);
    setPhone(nurse.phone);
    setEmail(nurse.email || '');
    setPassword(''); // Leave empty to keep existing password
    setGender(nurse.gender);
    setQualification(nurse.qualification);
    setExperienceYears(nurse.experienceYears);
    setSkills(nurse.skills);
    setBaseLocation(nurse.baseLocation || '');
    setPanNumber(nurse.panNumber || '');
    setAadharName(nurse.aadharName || '');
    setCertificationDocUrl(nurse.certificationDocUrl || '');
    setIsApproved(nurse.isApproved);
    setStatus(nurse.status);
    setIsFormOpen(true);
  };

  // Handle file upload to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image/PDF.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificationDocUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id: editingNurse?.id,
      name,
      phone,
      email: email.trim() || undefined,
      password: password.trim() || undefined,
      gender,
      qualification,
      experienceYears: Number(experienceYears),
      skills,
      baseLocation,
      panNumber: panNumber.trim() || undefined,
      aadharName: aadharName.trim() || undefined,
      certificationDocUrl: certificationDocUrl || undefined,
      isApproved,
      status,
    };

    const res = await upsertNurseRoster(payload);
    setLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      setIsFormOpen(false);
      setEditingNurse(null);
    }
  };

  const handleToggleApproval = async (nurse: NurseProfile) => {
    const nextStatus = !nurse.isApproved;
    if (!window.confirm(`Are you sure you want to ${nextStatus ? 'APPROVE' : 'SUSPEND'} employee access for ${nurse.name}?`)) {
      return;
    }
    const res = await toggleNurseApproval(nurse.id, nextStatus);
    if (res.error) alert(res.error);
  };

  const handleDelete = async (nurse: NurseProfile) => {
    if (!window.confirm(`Are you sure you want to permanently DELETE employee ${nurse.name}?`)) {
      return;
    }
    const res = await deleteNurseProfile(nurse.id);
    if (res.error) alert(res.error);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee & Caregiver Roster</h1>
          <p className="text-xs text-gray-500 mt-1">
            Administer employee login credentials, verify PAN / Aadhar &amp; certifications, and govern job board access.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          + Register New Employee
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4">
            {editingNurse ? `Edit Profile & Credentials: ${editingNurse.name}` : 'Register New Employee / Nurse Profile'}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 text-xs">
            {/* Section 1: Basic Profile */}
            <div className="sm:col-span-3 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                1. Personal & Contact Information
              </span>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Phone Number (Unique)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+919876543210"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Section 2: Flow 1 & Flow 2 Auth Credentials */}
            <div className="sm:col-span-3 pt-2 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                2. Employee Login Credentials (Admin-Issued)
              </span>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Portal Login Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nurse.name@withu.care"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">
                {editingNurse ? 'New Password (leave empty to keep)' : 'Initial Password'}
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingNurse ? 'Unchanged' : 'Use a unique strong password'}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isApprovedCheck"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor="isApprovedCheck" className="text-gray-700 font-bold cursor-pointer">
                Approved for Job Board Access
              </label>
            </div>

            {/* Section 3: Verification & KYC Documents */}
            <div className="sm:col-span-3 pt-2 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                3. Verification &amp; Certification Documents
              </span>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">PAN Card Number</label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Aadhaar Full Name</label>
              <input
                type="text"
                value={aadharName}
                onChange={(e) => setAadharName(e.target.value)}
                placeholder="Name as printed on Aadhaar"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Certification Document</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {certificationDocUrl && (
                <span className="text-[10px] text-green-600 font-bold block mt-1">✓ Document uploaded / attached</span>
              )}
            </div>

            {/* Section 4: Qualifications & Roster */}
            <div className="sm:col-span-3 pt-2 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                4. Qualifications &amp; Availability
              </span>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Qualification</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
                placeholder="e.g. B.Sc. Nursing"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Experience Years</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                min={0}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Roster Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                <option value="ACTIVE">Active (Available)</option>
                <option value="INACTIVE">Inactive (Hidden)</option>
                <option value="ON_DUTY">On Duty (Assigned)</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-semibold mb-1">Services Specializations (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="injections, wound_dressing, catheter_change"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Base Location (Hyderabad)</label>
              <input
                type="text"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Employee Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Listing Grid */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {nurses.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            📭 No employees registered. Click "+ Register New Employee" to add nurses.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">Employee / Contact</th>
                  <th className="p-4">Login Email</th>
                  <th className="p-4">PAN / Aadhaar</th>
                  <th className="p-4">Cert Documents</th>
                  <th className="p-4">Qualifications</th>
                  <th className="p-4">Approval State</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        {nurse.name} <span className="text-[10px] text-gray-400">({nurse.gender})</span>
                      </div>
                      <div className="text-gray-500 font-mono text-[11px]">{nurse.phone}</div>
                    </td>

                    <td className="p-4 text-gray-700 font-mono text-[11px]">
                      {nurse.email || <span className="text-gray-400 italic">Uses Phone</span>}
                    </td>

                    <td className="p-4 text-gray-700">
                      <div className="font-mono font-bold text-gray-900">PAN: {nurse.panNumber || 'N/A'}</div>
                      <div className="text-gray-500 text-[10px]">Aadhaar: {nurse.aadharName || 'N/A'}</div>
                    </td>

                    <td className="p-4">
                      {nurse.certificationDocUrl ? (
                        <button
                          onClick={() => setViewingDoc({ name: nurse.name, url: nurse.certificationDocUrl! })}
                          className="px-2 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded border border-primary-200 text-[10px] font-bold cursor-pointer"
                        >
                          📄 View Document
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">Not attached</span>
                      )}
                    </td>

                    <td className="p-4 text-gray-900">
                      <div className="font-medium">{nurse.qualification}</div>
                      <div className="text-gray-400 text-[10px]">Exp: {nurse.experienceYears} Years • {nurse.baseLocation || 'Hyderabad'}</div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                            nurse.isApproved
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {nurse.isApproved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-medium">Status: {nurse.status}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleApproval(nurse)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          nurse.isApproved
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {nurse.isApproved ? 'Revoke Access' : 'Approve Access'}
                      </button>

                      <button
                        onClick={() => openEditForm(nurse)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(nurse)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-sm">
                Certification Document: {viewingDoc.name}
              </h3>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto flex items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-200">
              {viewingDoc.url.startsWith('data:image') || viewingDoc.url.startsWith('http') ? (
                <img
                  src={viewingDoc.url}
                  alt={`Certification for ${viewingDoc.name}`}
                  className="max-h-[60vh] object-contain rounded"
                />
              ) : (
                <iframe
                  src={viewingDoc.url}
                  title="Document Preview"
                  className="w-full h-96 rounded"
                />
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
