'use client';

import React, { useState } from 'react';
import { updateServicePricing } from '@/actions/admin';

interface ServiceProfile {
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

export default function ServiceManager({ services }: ServiceManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editActive, setEditActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const startEdit = (service: ServiceProfile) => {
    setEditingId(service.id);
    setEditPrice(service.basePrice);
    setEditActive(service.isActive);
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    const res = await updateServicePricing(id, Number(editPrice), editActive);
    setLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Service Catalog & Pricing</h1>
        <p className="text-xs text-gray-500 mt-1">Adjust daily care rates, minimum commitment days, and toggle visibility on the customer booking portal.</p>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
              <th className="p-4">Care Service</th>
              <th className="p-4">Description</th>
              <th className="p-4">Base Rate Pricing</th>
              <th className="p-4">Min Duration</th>
              <th className="p-4">Visibility</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => {
              const isEditing = editingId === service.id;
              return (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">
                    {service.name}
                    <span className="text-[9px] text-gray-400 font-mono block mt-0.5">slug: {service.slug}</span>
                  </td>
                  <td className="p-4 text-gray-500 max-w-xs">{service.description}</td>
                  <td className="p-4 font-bold text-gray-900">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 max-w-[100px]">
                        <span className="text-gray-400">Rs.</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-full rounded border border-gray-300 px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:outline-none font-bold"
                          min={0}
                        />
                      </div>
                    ) : (
                      <span>Rs. {service.basePrice} / {service.priceUnit}</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {service.minimumDays} {service.priceUnit}(s)
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={editActive ? 'true' : 'false'}
                        onChange={(e) => setEditActive(e.target.value === 'true')}
                        className="rounded border border-gray-300 px-2 py-1 focus:outline-none"
                      >
                        <option value="true">Active (Portal visible)</option>
                        <option value="false">Hidden (Inactive)</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          service.isActive
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 text-gray-500 hover:text-gray-700 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSave(service.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded font-semibold transition-colors disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(service)}
                        className="text-primary-600 hover:text-primary-800 font-bold"
                      >
                        Modify pricing
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
