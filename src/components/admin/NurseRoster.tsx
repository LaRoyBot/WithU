'use client';

import React, { useState } from 'react';
import { upsertNurseRoster } from '@/actions/admin';

interface NurseProfile {
  id: string;
  name: string;
  phone: string;
  gender: string;
  qualification: string;
  experienceYears: number;
  skills: string;
  baseLocation: string | null;
  status: string;
}

interface NurseRosterProps {
  nurses: NurseProfile[];
}

export default function NurseRoster({ nurses }: NurseRosterProps) {
  const [editingNurse, setEditingNurse] = useState<NurseProfile | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [skills, setSkills] = useState('');
  const [baseLocation, setBaseLocation] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const openCreateForm = () => {
    setEditingNurse(null);
    setName('');
    setPhone('+91');
    setGender('Female');
    setQualification('GNM (General Nursing)');
    setExperienceYears(2);
    setSkills('wound_dressing, injections');
    setBaseLocation('Lingampally, Hyderabad');
    setStatus('ACTIVE');
    setIsFormOpen(true);
  };

  const openEditForm = (nurse: NurseProfile) => {
    setEditingNurse(nurse);
    setName(nurse.name);
    setPhone(nurse.phone);
    setGender(nurse.gender);
    setQualification(nurse.qualification);
    setExperienceYears(nurse.experienceYears);
    setSkills(nurse.skills);
    setBaseLocation(nurse.baseLocation || '');
    setStatus(nurse.status);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id: editingNurse?.id,
      name,
      phone,
      gender,
      qualification,
      experienceYears: Number(experienceYears),
      skills,
      baseLocation,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nurse Caregiver Roster</h1>
          <p className="text-xs text-gray-500 mt-1">Register nurses, update qualifications, and audit active schedule availability.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          + Add Nurse Profile
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4">
            {editingNurse ? `Edit Profile: ${editingNurse.name}` : 'Register New Nurse'}
          </h3>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 text-xs">
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
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-semibold transition-colors"
              >
                {loading ? 'Saving...' : 'Save Nurse Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Listing Grid */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {nurses.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            📭 No nurses registered. Click "+ Add Nurse" to seed the roster.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">Nurse Caregiver</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Credentials</th>
                  <th className="p-4">Specialties</th>
                  <th className="p-4">Base Location</th>
                  <th className="p-4">Roster Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {nurse.name} <span className="text-[10px] text-gray-400">({nurse.gender})</span>
                    </td>
                    <td className="p-4 text-gray-500">{nurse.phone}</td>
                    <td className="p-4 text-gray-900 font-medium">
                      {nurse.qualification} <span className="text-gray-400 text-[10px] block mt-0.5">Exp: {nurse.experienceYears} Years</span>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-[10px]">
                      {nurse.skills}
                    </td>
                    <td className="p-4 text-gray-500">{nurse.baseLocation || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          nurse.status === 'ACTIVE'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : nurse.status === 'ON_DUTY'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {nurse.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditForm(nurse)}
                        className="text-primary-600 hover:text-primary-800 font-bold"
                      >
                        Edit Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
