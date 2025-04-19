'use client';

import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(() => import('./DashboardLayout'), {
  ssr: false,
});

export default function DashboardWrapper({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 