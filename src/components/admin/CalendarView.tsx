'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CalendarBooking {
  id: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  patientName: string;
  customer: {
    name: string;
    phone: string;
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

interface CalendarViewProps {
  initialBookings: CalendarBooking[];
}

export default function CalendarView({ initialBookings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get start of month and start day of week
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Monday...

  // Get total days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to check if a booking overlaps with a specific date
  const getBookingsForDate = (date: Date) => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    return initialBookings.filter((b) => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      return bStart <= dayEnd && bEnd >= dayStart;
    });
  };

  // Generate calendar grid array
  const calendarCells = [];

  // Empty slots for days before start day of month
  // We align Sunday as index 0, Monday as 1, etc.
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }

  // Days of the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    calendarCells.push(new Date(year, month, day));
  }

  // Group into rows of 7 days
  const rows: (Date | null)[][] = [];
  let currentRow: (Date | null)[] = [];

  calendarCells.forEach((cell, index) => {
    currentRow.push(cell);
    if (currentRow.length === 7 || index === calendarCells.length - 1) {
      // Fill remaining row spaces if last row is incomplete
      while (currentRow.length < 7) {
        currentRow.push(null);
      }
      rows.push(currentRow);
      currentRow = [];
    }
  });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blocked Slots Calendar</h1>
          <p className="text-xs text-gray-500 mt-1">
            Visual scheduler tracking patient visits and blocked staff caregiver resources.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm self-start">
          <button
            onClick={prevMonth}
            className="text-gray-600 hover:text-primary-600 font-extrabold text-sm transition-colors"
          >
            ◀
          </button>
          <span className="font-bold text-xs text-gray-800 min-w-[100px] text-center uppercase tracking-wider">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="text-gray-600 hover:text-primary-600 font-extrabold text-sm transition-colors"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-gray-50 text-center font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 py-3">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="divide-y divide-gray-100">
          {rows.map((row, rIndex) => (
            <div key={rIndex} className="grid grid-cols-7 divide-x divide-gray-100 min-h-[120px]">
              {row.map((day, cIndex) => {
                if (!day) {
                  return <div key={cIndex} className="bg-gray-50/40 p-2 min-h-[120px]" />;
                }

                const dayBookings = getBookingsForDate(day);
                const isToday = new Date().toDateString() === day.toDateString();

                return (
                  <div
                    key={cIndex}
                    className={`p-2 min-h-[120px] transition-colors relative flex flex-col justify-between ${
                      isToday ? 'bg-primary-50/20' : 'hover:bg-gray-50/30'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                          isToday
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-900'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1 rounded">
                          {dayBookings.length} Slot{dayBookings.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Bookings Lists for this Day */}
                    <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[85px] pt-1">
                      {dayBookings.map((b) => {
                        const hasNurse = !!b.nurse;
                        return (
                          <div
                            key={b.id}
                            className={`p-1.5 rounded border text-[9px] leading-tight space-y-0.5 transition-all hover:shadow-sm ${
                              hasNurse
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-950'
                                : 'bg-amber-50 border-amber-100 text-amber-950'
                            }`}
                          >
                            <div className="flex justify-between items-center gap-1 font-extrabold text-[10px]">
                              <span className="truncate">{b.patientName}</span>
                              <span className="text-[8px] font-mono text-slate-400 shrink-0">
                                {b.bookingNumber}
                              </span>
                            </div>
                            <div className="truncate font-medium text-slate-500">
                              {b.service.name}
                            </div>

                            {/* Nurse Alloc Block */}
                            <div className="pt-0.5 mt-0.5 border-t border-black/5 flex justify-between items-center">
                              {hasNurse ? (
                                <span className="font-bold flex items-center gap-0.5">
                                  👩‍⚕️ {b.nurse?.name}
                                </span>
                              ) : (
                                <span className="font-bold text-red-600 uppercase text-[8px] tracking-wider animate-pulse flex items-center gap-0.5">
                                  ⚠️ Unassigned
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* View Button Link to detail queue if slots exist */}
                    {dayBookings.length > 0 && (
                      <div className="pt-1 text-right">
                        <Link
                          href="/admin"
                          className="text-[8px] font-bold text-primary-600 hover:underline uppercase tracking-wide"
                        >
                          Manage →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
