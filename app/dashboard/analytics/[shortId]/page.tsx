'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import MetricsCards from '@/components/analytics/MetricsCards';
import TimeSeriesChart from '@/components/analytics/TimeSeriesChart';
import ReferrerTable from '@/components/analytics/ReferrerTable';
import GeographicBreakdown from '@/components/analytics/GeographicBreakdown';
import RecentActivity from '@/components/analytics/RecentActivity';
import mockData from '@/app/data/mockData'; // Correct path for mockData
import styles from './AnalyticsPage.module.css';

interface AnalyticsData {
  shortId: string;
  shortUrl: string;
  originalUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  ctr: string;
  avgDailyClicks: number;
  timeSeriesData: {
    '7d': { date: string; clicks: number }[];
    '30d': { date: string; clicks: number }[];
  };
  referrerData: { domain: string; clicks: number; percentage: string }[];
  geographicData: { country: string; clicks: number }[];
  recentActivity: { timestamp: string; source: string; location: string }[];
}

const AnalyticsPage = () => {
  const params = useParams();
  const shortId = params.shortId as string;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d'>('30d'); // Default to 30 days

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate fetching data for the specific shortId and dateRange
    const data = mockData.find(d => d.shortId === shortId);
    if (data) {
      setAnalyticsData(data);
    } else {
      setError('Analytics data not found for this URL.');
    }
    setLoading(false);
  }, [shortId, dateRange]);

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  if (!analyticsData) {
    return <div className="p-4 text-center text-gray-600">No analytics data available.</div>;
  }

  return (
    <div className={styles.analyticsPageContainer}>
      <AnalyticsHeader shortUrl={analyticsData.shortUrl} originalUrl={analyticsData.originalUrl} onDateRangeChange={setDateRange} currentDateRange={dateRange} />
      
      <div className={styles.metricsGrid}>
        <MetricsCards 
          totalClicks={analyticsData.totalClicks}
          uniqueVisitors={analyticsData.uniqueVisitors}
          ctr={analyticsData.ctr}
          avgDailyClicks={analyticsData.avgDailyClicks}
        />
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Clicks Over Time</h3>
        <TimeSeriesChart data={analyticsData.timeSeriesData[dateRange]} />
      </div>

      <div className={styles.twoColumnGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Referrer Sources</h3>
          <ReferrerTable data={analyticsData.referrerData} />
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Geographic Breakdown</h3>
          <GeographicBreakdown data={analyticsData.geographicData} />
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Recent Activity</h3>
        <RecentActivity data={analyticsData.recentActivity} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
