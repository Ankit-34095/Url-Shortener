'use client';

import React from 'react';
import styles from './MetricsCards.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  const trendColorClass = trend && trend.includes('+') ? styles.trendGreen : trend && trend.includes('-') ? styles.trendRed : styles.trendGray;

  return (
    <div className={styles.metricCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
      {trend && <p className={`${styles.trendText} ${trendColorClass}`}>{trend}</p>}
    </div>
  );
};

interface MetricsCardsProps {
  totalClicks: number;
  uniqueVisitors: number;
  ctr: string;
  avgDailyClicks: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ totalClicks, uniqueVisitors, ctr, avgDailyClicks }) => {
  return (
    <>
      <MetricCard title="Total Clicks" value={totalClicks} trend="+5.2% (last 7 days)" />
      <MetricCard title="Unique Visitors" value={uniqueVisitors} trend="+3.1% (last 7 days)" />
      <MetricCard title="Click-Through Rate" value={ctr} trend="-0.5% (last 7 days)" />
      <MetricCard title="Avg. Daily Clicks" value={avgDailyClicks} trend="+1.8% (last 7 days)" />
    </>
  );
};

export default MetricsCards;
