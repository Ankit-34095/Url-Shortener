'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { formatApiError } from '@/lib/api';

interface URLItem {
  id: number;
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  createdAt: string;
}

interface UrlPageResponse {
  content: URLItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const AnalyticsPage = () => {
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: UrlPageResponse = await api<UrlPageResponse>(
          '/urls?page=0&size=100&sortBy=createdAt&sortDir=desc',
          { method: 'GET' }
        );
        setUrls(response.content);
      } catch (err: any) {
        setError(formatApiError(err, 'Failed to load analytics data.'));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading analytics...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>{error}</div>;
  }

  if (urls.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Data not found.</p>
        <p>Shorten a URL first to see its analytics here.</p>
        <Link href="/dashboard" style={{ color: '#2563eb', marginTop: '1rem', display: 'inline-block' }}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const totalClicks = urls.reduce((sum, url) => sum + url.totalClicks, 0);

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Analytics Overview</h1>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '2rem',
      }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total URLs</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>{urls.length}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Clicks</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>{totalClicks}</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Short URL</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Original URL</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Total Clicks</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link href={`/r/${url.shortCode}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    /r/{url.shortCode}
                  </Link>
                </td>
                <td style={{ padding: '0.75rem 1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6b7280' }}>
                  {url.originalUrl}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{url.totalClicks}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {new Date(url.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
