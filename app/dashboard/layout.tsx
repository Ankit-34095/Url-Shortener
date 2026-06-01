'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/auth-context';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className={styles.contentArea}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
}
