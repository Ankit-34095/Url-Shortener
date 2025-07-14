'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
}
