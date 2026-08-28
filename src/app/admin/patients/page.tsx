import React from 'react';
import { prisma } from '@/lib/prisma';
import { getAdminPatients } from '@/actions/admin';
import PatientManager, { PatientRecord } from '@/components/admin/PatientManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPatientsPage() {
  let patients: PatientRecord[] = [];
  let services: { id: string; name: string; basePrice: number }[] = [];

  try {
    const [patientsRes, rawServices] = await Promise.all([
      getAdminPatients(),
      prisma.service.findMany({
        select: { id: true, name: true, basePrice: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    if (patientsRes.success && patientsRes.patients) {
      patients = patientsRes.patients as PatientRecord[];
    }

    services = rawServices.map((s) => ({
      id: s.id,
      name: s.name,
      basePrice: Number(s.basePrice),
    }));
  } catch (err) {
    console.error('Error fetching admin patients page data:', err);
  }

  return (
    <PatientManager
      initialPatients={patients}
      services={services}
    />
  );
}
