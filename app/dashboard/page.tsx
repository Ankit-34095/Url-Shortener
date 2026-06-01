'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickShortenForm from '@/components/dashboard/QuickShortenForm';
import URLsTable from '@/components/dashboard/URLsTable';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewShortUrl = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={styles.dashboardPageContainer}>
      <DashboardHeader />
      <QuickShortenForm onShorten={handleNewShortUrl} />
      <URLsTable refreshKey={refreshKey} />
    </div>
  );
};

export default DashboardPage;
