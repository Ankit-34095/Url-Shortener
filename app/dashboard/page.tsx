'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickShortenForm from '@/components/dashboard/QuickShortenForm';
import URLsTable from '@/components/dashboard/URLsTable';
import styles from './DashboardPage.module.css';

interface URLItem {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  created: string;
  customAlias?: string;
  expirationDate?: string;
  passwordProtected?: boolean;
  tags?: string[];
}

const DashboardPage = () => {
  const [urls, setUrls] = useState<URLItem[]>([
    { id: '1', shortUrl: 'short.url/abcde', originalUrl: 'https://www.google.com', clicks: 120, created: '2023-01-15' },
    { id: '2', shortUrl: 'short.url/fghij', originalUrl: 'https://www.youtube.com', clicks: 85, created: '2023-02-20' },
    { id: '3', shortUrl: 'short.url/klmno', originalUrl: 'https://www.github.com', clicks: 230, created: '2023-03-10' },
  ]);

  const handleNewShortUrl = (newUrl: Omit<URLItem, 'id'>) => {
    setUrls((prevUrls) => [...prevUrls, { ...newUrl, id: String(prevUrls.length + 1) }]);
  };

  return (
    <div className={styles.dashboardPageContainer}>
      <DashboardHeader />
      <QuickShortenForm onShorten={handleNewShortUrl} />
      <URLsTable urls={urls} />
    </div>
  );
};

export default DashboardPage;
