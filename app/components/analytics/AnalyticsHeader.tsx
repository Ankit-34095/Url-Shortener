'use client';

import React from 'react';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import styles from './AnalyticsHeader.module.css';

interface AnalyticsHeaderProps {
  shortUrl: string;
  originalUrl: string;
  onDateRangeChange: (range: '7d' | '30d') => void;
  currentDateRange: '7d' | '30d';
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ shortUrl, originalUrl, onDateRangeChange, currentDateRange }) => {
  return (
    <div className={styles.analyticsHeaderContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" className={styles.backButton} title="Back to Dashboard">
          <MdArrowBack size={24} />
        </Link>
        <div>
          <p className={styles.analyticsForText}>Analytics for:</p>
          <h1 className={styles.shortUrlTitle}><a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></h1>
          <p className={styles.originalUrlText}><a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a></p>
        </div>
      </div>

      <div className={styles.dateRangeButtons}>
        <button
          onClick={() => onDateRangeChange('7d')}
          className={`${styles.dateRangeButton} ${
            currentDateRange === '7d' ? styles.active : ''
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => onDateRangeChange('30d')}
          className={`${styles.dateRangeButton} ${
            currentDateRange === '30d' ? styles.active : ''
          }`}
        >
          30 Days
        </button>
        {/* Add more date range options if needed */}
      </div>
    </div>
  );
};

export default AnalyticsHeader;
