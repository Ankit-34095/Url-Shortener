'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

const AnalyticsDetailPage = () => {
  const params = useParams();
  const shortId = params.shortId as string;

  return (
    <div style={{ padding: '1rem' }}>
      <Link
        href="/dashboard/analytics"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#2563eb',
          textDecoration: 'none',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}
      >
        <MdArrowBack size={18} />
        Back to Analytics
      </Link>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Analytics for /r/{shortId}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          View detailed analytics for each URL from your Dashboard.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsDetailPage;
