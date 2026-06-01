'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { getCookie } from 'cookies-next';
import styles from './DashboardHeader.module.css';

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const [totalUrls, setTotalUrls] = useState<number | null>(null);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const token = getCookie('token') as string | undefined;
    if (!token) return;

    api<{ totalElements: number }>('/urls?page=0&size=1', {
      method: 'GET',
      token,
    }).then((res) => {
      setTotalUrls(res.totalElements);
    }).catch(() => {});
  }, []);

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.userInfo}>
        <h1 className={styles.welcomeText}>Welcome back, {displayName}!</h1>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>Total URLs</p>
          <p className={`${styles.statValue} ${styles.blueText}`}>{totalUrls !== null ? totalUrls : '...'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
