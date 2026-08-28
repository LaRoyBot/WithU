'use client';

import React, { useState } from 'react';
import { upsertService } from '@/actions/admin';

export interface ServiceProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  priceUnit: string;
  minimumDays: number;
  isActive: boolean;
}

interface ServiceManagerProps {
  services: ServiceProfile[];
}

export default function ServiceManager({ services: initialServices }: ServiceManagerProps) {
  const [services, setServices] = useState<ServiceProfile[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(1000);
  const [priceUnit, setPriceUnit] = useState('day');
  const [minimumDays, setMinimumDays] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setServiceId(undefined);
    setName('');
    setDescription('');
    setBasePrice(1000);
    setPriceUnit('day');
    setMinimumDays(1);
    setIsActive(true);
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceProfile) => {
    setServiceId(service.id);
    setName(service.name);
    setDescription(service.description);
    setBasePrice(Number(service.basePrice));
    setPriceUnit(service.priceUnit || 'day');
    setMinimumDays(service.minimumDays || 1);
    setIsActive(service.isActive);
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await upsertService({
        id: serviceId,
        name: name.trim(),
        description: description.trim(),
        basePrice: Number(basePrice),
        priceUnit: priceUnit.trim(),
        minimumDays: Number(minimumDays),
        isActive,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess('Service saved successfully!');
        // Refresh local view
        if (serviceId) {
          setServices((prev) =>
            prev.map((s) =>
              s.id === serviceId
                ? {
                    ...s,
                    name: name.trim(),
                    description: description.trim(),
                    basePrice: Number(basePrice),
                    priceUnit: priceUnit.trim(),
                    minimumDays: Number(minimumDays),
                    isActive,
                  }
                : s
            )
          );
        } else {
          // Re-render
          setServices((prev) => [
            ...prev,
            {
              id: 'temp-' + Date.now(),
              name: name.trim(),
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: description.trim(),
              basePrice: Number(basePrice),
              priceUnit: priceUnit.trim(),
              minimumDays: Number(minimumDays),
              isActive,
            },
          ]);
        }

        setTimeout(() => {
          setModalOpen(false);
          setSuccess('');
        }, 1000);
      }
    } catch (err: any) {
      setError('Failed to save service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Catalog & Pricing</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your nursing care packages, set daily/hourly rates, and configure visibility on the booking form.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span>＋</span> Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Care Service</th>
                <th className="p-4">Description</th>
                <th className="p-4">Base Rate Pricing</th>
                <th className="p-4">Min Duration</th>
                <th className="p-4">Portal Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-gray-900 text-sm block">{service.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">slug: {service.slug}</span>
                  </td>
                  <td className="p-4 text-gray-600 max-w-sm">{service.description}</td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{service.basePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-500 block">per {service.priceUnit}</span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {service.minimumDays} {service.priceUnit}(s)
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        service.isActive
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {service.isActive ? 'Active (Visible)' : 'Hidden (Inactive)'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => openEditModal(service)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded text-xs transition-colors"
                    >
                      Edit Service
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {serviceId ? 'Edit Nursing Service' : 'Add New Nursing Service'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Service Name */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical ICU Care (24 Hours)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive bedside nursing care for post-operative and ICU patients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Pricing & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price Unit</label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="day">per day</option>
                    <option value="visit">per visit</option>
                    <option value="month">per month</option>
                  </select>
                </div>
              </div>

              {/* Minimum Duration & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Minimum Days</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={minimumDays}
                    onChange={(e) => setMinimumDays(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Visibility</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden (Inactive)</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
