import React from 'react';
import type { Metadata } from 'next';
import ClassicBlogspotPage from '@/components/classic/ClassicBlogspotPage';

export const metadata: Metadata = {
  title: 'Neetha Nursing Service at Home | Certified Nursing in Hyderabad',
  description:
    'Looking for reliable and expert nursing services at home? Our team provides specialized care for injections, wound dressing, and urinary catheter care in Hyderabad.',
};

export default function ClassicPage() {
  return <ClassicBlogspotPage />;
}
