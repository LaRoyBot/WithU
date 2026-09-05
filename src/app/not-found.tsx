import React from 'react';
import { Metadata } from 'next';
import ErrorFace404 from '@/components/creative/Creative404Scene';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Neetha Nursing Service Hyderabad',
  description: 'The page you requested could not be found. Return to Neetha Nursing Service homepage or connect with our 24/7 clinical care coordination team in Hyderabad.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <ErrorFace404 />;
}
