import React from 'react';
import { Metadata } from 'next';
import AccessDenied403View from '@/components/creative/AccessDenied403View';

export const metadata: Metadata = {
  title: '403 Forbidden - Restricted Health Record | Neetha Nursing Service',
  description: 'Digital Personal Data Protection (DPDP) Act 2023 compliance gate. Authenticated access required for patient clinical health records.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccessDeniedPage() {
  return <AccessDenied403View />;
}
