import React from 'react';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import Link from 'next/link';

interface StatusPageProps {
  searchParams: Promise<{ id?: string }>;
}

// Function to map status to human-readable text and color classes
function getStatusDetails(status: string) {
  switch (status) {
    case 'PENDING_OTP':
      return { text: 'Awaiting Verification', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'CONFIRMED':
      return { text: 'Confirmed (Matching Nurse)', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'NURSE_ASSIGNED':
      return { text: 'Nurse Assigned', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
    case 'IN_PROGRESS':
      return { text: 'Service in Progress', color: 'bg-green-100 text-green-800 border-green-200' };
    case 'COMPLETED':
      return { text: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    case 'CANCELLED':
      return { text: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' };
    default:
      return { text: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
}

export const revalidate = 0;

export default async function BookingStatusPage({ searchParams }: StatusPageProps) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-gray-900">Missing Booking Identifier</h2>
        <p className="text-xs text-gray-500 mt-2">Please use the exact link sent to your mobile phone number.</p>
        <div className="mt-4"><Link href="/" className="btn-primary text-xs">Return Home</Link></div>
      </div>
    );
  }

  let booking = null;
  let statusEvents: any[] = [];

  try {
    booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        nurse: true,
        statusEvents: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (booking) {
      statusEvents = booking.statusEvents;
    }
  } catch (err) {
    console.error('Database connection failed while fetching status.');
  }

  // Preview Mock if DB is not set up
  if (!booking) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-gray-900">Booking Record Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The booking ID <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-xs">{id}</code> could not be located in our active records.
        </p>
        <div className="mt-6">
          <Link href="/booking" className="btn-primary text-xs">Book a Visit</Link>
        </div>
      </div>
    );
  }

  // Decrypt Patient Name for displaying to the authorized visitor
  const decryptedPatientName = decrypt(booking.patientName);
  const statusDetails = getStatusDetails(booking.status);

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-primary-50 border-b border-primary-100 py-4 px-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Booking Status Page</span>
          <h1 className="text-lg font-bold text-gray-900 font-mono mt-0.5">{booking.bookingNumber}</h1>
        </div>
        <div>
          <span className={`inline-block px-3 py-1 border rounded text-xs font-semibold ${statusDetails.color}`}>
            {statusDetails.text}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Care Plan Card */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-5 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Service Details</h4>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{booking.service.name}</p>
              <p className="text-xs text-gray-500">{booking.shiftType === 'DAY_12HR' ? '12-Hour Day Shift' : booking.shiftType === 'NIGHT_12HR' ? '12-Hour Night Shift' : booking.shiftType === 'FULL_24HR' ? '24-Hour Live-in Care' : 'Hourly Visits'}</p>
              <p className="text-xs text-gray-500">Duration: {booking.totalDays} Days ({new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()})</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Patient Profile</h4>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{decryptedPatientName}</p>
              <p className="text-xs text-gray-500">Age/Gender: {booking.patientAge} / {booking.patientGender}</p>
              <p className="text-xs text-gray-500">Care Address: {booking.customer.addressLine1}, {booking.customer.pincode}</p>
            </div>
          </div>
        </div>

        {/* Assigned Nurse Profile */}
        {booking.status === 'NURSE_ASSIGNED' && booking.nurse ? (
          <div className="border border-indigo-100 bg-indigo-50/50 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg uppercase">
              {booking.nurse.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left flex-1 space-y-0.5">
              <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">Assigned Caregiver</span>
              <h3 className="font-bold text-gray-900">{booking.nurse.name}</h3>
              <p className="text-xs text-gray-500">{booking.nurse.qualification} ({booking.nurse.experienceYears} Years Exp)</p>
            </div>
            <div>
              <a
                href={`tel:${booking.nurse.phone}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
              >
                📞 Call Nurse
              </a>
            </div>
          </div>
        ) : (
          booking.status === 'CONFIRMED' && (
            <div className="border border-yellow-100 bg-yellow-50/30 rounded-lg p-5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-yellow-800 uppercase">Coordinating Assignment</h4>
              <p className="text-xs text-gray-500 mt-1">Our team is vetting and scheduling the best nurse specialized in {booking.service.name.toLowerCase()} for your home location. We will update this page and notify you on WhatsApp once completed.</p>
            </div>
          )
        )}

        {/* Live Timeline Audit Trail */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Booking Timeline</h3>
          <div className="relative border-l border-gray-200 ml-3 pl-5 space-y-6">
            {statusEvents.map((event, idx) => (
              <div key={event.id} className="relative">
                {/* Bullet */}
                <span className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-primary-600 border-2 border-white ring-4 ring-primary-50"></span>
                <div className="text-xs">
                  <div className="flex justify-between items-center text-gray-400">
                    <span className="font-semibold text-gray-700">
                      {event.toStatus === 'CONFIRMED' ? 'Phone Verified & Request Received' : event.toStatus === 'NURSE_ASSIGNED' ? 'Nurse Assigned' : event.toStatus === 'IN_PROGRESS' ? 'Care Visit Started' : event.toStatus === 'COMPLETED' ? 'Booking Completed Successfully' : event.toStatus === 'CANCELLED' ? 'Booking Cancelled' : event.toStatus}
                    </span>
                    <span>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.createdAt).toLocaleDateString()}</span>
                  </div>
                  {event.notes && <p className="text-gray-500 mt-1">{event.notes}</p>}
                </div>
              </div>
            ))}

            {/* Initial booking log if no events recorded */}
            <div className="relative">
              <span className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-gray-400 border-2 border-white ring-4 ring-gray-50"></span>
              <div className="text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="font-semibold text-gray-600">Booking Form Created</span>
                  <span>{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-400 mt-1">Awaiting OTP authentication.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-xs">
          <span className="text-gray-400">Bookmark this page to track your care anytime.</span>
          <Link href="/" className="text-primary-600 hover:text-primary-800 font-semibold">
            Need Help? Chat Support
          </Link>
        </div>
      </div>
    </div>
  );
}
