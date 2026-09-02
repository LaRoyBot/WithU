import React from 'react';
import { prisma } from '@/lib/prisma';
import NurseRoster from '@/components/admin/NurseRoster';
import { decrypt } from '@/lib/crypto';

export const revalidate = 0;

export default async function AdminRosterPage() {
  let nursesList: any[] = [];
  try {
    const rawNurses = await prisma.nurse.findMany({
      orderBy: { name: 'asc' },
    });

    nursesList = rawNurses.map((n) => {
      let pan = n.panNumber;
      let aadhar = n.aadharName;
      try {
        if (pan && pan.includes(':')) pan = decrypt(pan);
      } catch {}
      try {
        if (aadhar && aadhar.includes(':')) aadhar = decrypt(aadhar);
      } catch {}

      return {
        ...n,
        panNumber: pan,
        aadharName: aadhar,
      };
    });
  } catch (err) {
    console.error('Database connection failed for nurse roster:', err);
  }

  return <NurseRoster nurses={nursesList} />;
}
