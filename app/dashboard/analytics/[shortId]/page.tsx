'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import MetricsCards from '@/components/analytics/MetricsCards';
import TimeSeriesChart from '@/components/analytics/TimeSeriesChart';
import ReferrerTable from '@/components/analytics/ReferrerTable';
import GeographicBreakdown from '@/components/analytics/GeographicBreakdown';
import api, { formatApiError } from '@/lib/api';
import styles from '../AnalyticsPage.module.css';

interface DailyClick {
  date: string;
  clicks: number;
}

interface ReferrerStats {
  referrer: string | null;
  clicks: number;
}

interface CountryStats {
  countryCode: string | null;
  countryName: string | null;
  clicks: number;
}

interface UrlAnalytics {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  dailyClicks: DailyClick[];
  topReferrers: ReferrerStats[];
  topCountries: CountryStats[];
}

const AnalyticsDetailPage = () => {
  const params = useParams();
  const shortId = params.shortId as string;
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d'>('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      const token = getCookie('token') as string | undefined;
      if (!token) {
        setError('You must be logged in to view analytics.');
        setLoading(false);
        return;
      }

      try {
        const response = await api<UrlAnalytics>(`/analytics/${shortId}`, {
          method: 'GET',
          token,
        });
        setAnalytics(response);
      } catch (err) {
        setError(formatApiError(err, 'Failed to load URL analytics.'));
      } finally {
        setLoading(false);
      }
    };

    if (shortId) {
      fetchAnalytics();
    }
  }, [shortId]);

  const filteredDailyClicks = useMemo(() => {
    if (!analytics?.dailyClicks) return [];

    const days = dateRange === '7d' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return analytics.dailyClicks
      .filter((item) => new Date(item.date) >= cutoff)
      .map((item) => ({
        date: new Date(item.date).toLocaleDateString(),
        clicks: item.clicks,
      }));
  }, [analytics, dateRange]);

  const totalClicks = analytics?.totalClicks ?? 0;
  const filteredClickTotal = filteredDailyClicks.reduce((sum, item) => sum + item.clicks, 0);
  const avgDailyClicks = filteredDailyClicks.length
    ? Math.round(filteredClickTotal / filteredDailyClicks.length)
    : 0;

  const referrerData = useMemo(() => {
    if (!analytics?.topReferrers) return [];

    return analytics.topReferrers.map((item) => ({
      domain: item.referrer || 'Direct / Unknown',
      clicks: item.clicks,
      percentage: totalClicks > 0 ? `${Math.round((item.clicks / totalClicks) * 100)}%` : '0%',
    }));
  }, [analytics, totalClicks]);

  const countryData = useMemo(() => {
    if (!analytics?.topCountries) return [];

    return analytics.topCountries.map((item) => ({
      country: item.countryName || item.countryCode || 'Unknown',
      clicks: item.clicks,
    }));
  }, [analytics]);

  if (loading) {
    return <div className={styles.loadingMessage}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  if (!analytics) {
    return <div className={styles.noDataMessage}>Data not found.</div>;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api').replace('/api', '');
  const shortUrl = `${baseUrl}/r/${analytics.shortCode}`;

  return (
    <div className={styles.analyticsPageContainer}>
      <AnalyticsHeader
        shortUrl={shortUrl}
        originalUrl={analytics.originalUrl}
        currentDateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className={styles.metricsGrid}>
        <MetricsCards
          totalClicks={analytics.totalClicks}
          uniqueVisitors={analytics.uniqueVisitors}
          ctr="N/A"
          avgDailyClicks={avgDailyClicks}
        />
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Clicks Over Time</h2>
        <TimeSeriesChart data={filteredDailyClicks} />
      </section>

      <div className={styles.twoColumnGrid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Top Referrers</h2>
          <ReferrerTable data={referrerData} />
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Top Countries</h2>
          <GeographicBreakdown data={countryData} />
        </section>
      </div>
    </div>
  );
};

export default AnalyticsDetailPage;
