import React from 'react';
import { prisma } from '@/lib/prisma';
import NurseRoster from '@/components/admin/NurseRoster';

export const revalidate = 0;

export default async function AdminRosterPage() {
  let nursesList: any[] = [];
  try {
    nursesList = await prisma.nurse.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.error('Database connection failed for nurse roster:', err);
  }

  return <NurseRoster nurses={nursesList} />;
}
