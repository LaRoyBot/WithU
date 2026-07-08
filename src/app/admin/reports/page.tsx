import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminReportsPage() {
  let totalBookings = 0;
  let bookingsByStatus = {
    CONFIRMED: 0,
    NURSE_ASSIGNED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  let servicePopularity: { name: string; count: number; earnings: number }[] = [];
  let completionRate = 0;

  try {
    // 1. Get totals
    totalBookings = await prisma.booking.count({
      where: { status: { not: 'PENDING_OTP' } },
    });

    // 2. Group by status
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      where: { status: { not: 'PENDING_OTP' } },
      _count: { id: true },
    });

    statusCounts.forEach((group) => {
      const statusKey = group.status as keyof typeof bookingsByStatus;
      if (statusKey in bookingsByStatus) {
        bookingsByStatus[statusKey] = group._count.id;
      }
    });

    // 3. Calculate completion rate: Completed / (Completed + Cancelled)
    const completed = bookingsByStatus.COMPLETED;
    const cancelled = bookingsByStatus.CANCELLED;
    const totalEnded = completed + cancelled;
    completionRate = totalEnded > 0 ? Math.round((completed / totalEnded) * 100) : 100;

    // 4. Fetch service popularity & mock aggregation
    const activeServices = await prisma.service.findMany({
      include: {
        bookings: {
          where: { status: { not: 'PENDING_OTP' } },
        },
      },
    });

    servicePopularity = activeServices.map((service) => {
      const count = service.bookings.length;
      const earnings = service.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
      return {
        name: service.name,
        count,
        earnings,
      };
    }).sort((a, b) => b.count - a.count);

  } catch (err) {
    console.error('Error fetching analytics reports:', err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Reports</h1>
        <p className="text-xs text-gray-500 mt-1">Review conversion metrics, caregiver utilization, and clinical demand.</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Bookings</span>
          <span className="text-3xl font-extrabold text-gray-900 block mt-1">{totalBookings}</span>
          <span className="text-[10px] text-gray-400 block mt-2">Verified phone requests</span>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Ongoing Cases</span>
          <span className="text-3xl font-extrabold text-primary-700 block mt-1">
            {bookingsByStatus.NURSE_ASSIGNED + bookingsByStatus.IN_PROGRESS}
          </span>
          <span className="text-[10px] text-gray-400 block mt-2">Allocated & active on field</span>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Completion Rate</span>
          <span className="text-3xl font-extrabold text-green-600 block mt-1">{completionRate}%</span>
          <span className="text-[10px] text-gray-400 block mt-2">Completed vs. Cancelled</span>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Pending Allocation</span>
          <span className="text-3xl font-extrabold text-amber-600 block mt-1">{bookingsByStatus.CONFIRMED}</span>
          <span className="text-[10px] text-amber-600 block mt-2 font-semibold">Needs nurse matching</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Demand by Service */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Demand by Care Service</h3>
          <div className="space-y-3">
            {servicePopularity.map((service, idx) => {
              const maxCount = servicePopularity[0]?.count || 1;
              const barWidth = Math.max(5, Math.round((service.count / maxCount) * 100));

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium text-gray-800">{service.name}</span>
                    <span className="font-mono text-gray-500">{service.count} bookings (Rs. {service.earnings})</span>
                  </div>
                  {/* Progress Visual Bar */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-600 h-full rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Status Breakdown */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Operations Funnel</h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 text-gray-600">
              <span>1. Confirmed Requests (Awaiting Nurse)</span>
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{bookingsByStatus.CONFIRMED}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 text-gray-600">
              <span>2. Nurse Assigned (Ready)</span>
              <span className="font-bold text-gray-900 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{bookingsByStatus.NURSE_ASSIGNED}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 text-gray-600">
              <span>3. Active Visits (In Progress)</span>
              <span className="font-bold text-gray-900 bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{bookingsByStatus.IN_PROGRESS}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 text-gray-600">
              <span>4. Successfully Completed</span>
              <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded">{bookingsByStatus.COMPLETED}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-gray-600">
              <span>5. Cancelled Cases</span>
              <span className="font-bold text-gray-900 bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{bookingsByStatus.CANCELLED}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
