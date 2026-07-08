import React from 'react';
import { prisma } from '@/lib/prisma';
import ServiceManager from '@/components/admin/ServiceManager';

export const revalidate = 0;

export default async function AdminServicesPage() {
  let servicesList: any[] = [];
  try {
    servicesList = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (err) {
    console.error('Database connection failed for services admin page:', err);
  }

  return <ServiceManager services={servicesList} />;
}
