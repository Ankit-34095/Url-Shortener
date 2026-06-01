'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdContentCopy, MdOutlineAnalytics, MdDelete } from 'react-icons/md';
import { useToast } from '@/components/shared/Toast';
import api, { formatApiError } from '@/lib/api';
import { getCookie } from 'cookies-next';

interface URLItem {
  id: number;
  shortCode: string;
  originalUrl: string;
  title?: string;
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

const MyUrlsPage = () => {
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const showToast = useToast();
  const itemsPerPage = 10;

  const fetchUrls = async () => {
    setLoading(true);
    setError(null);
    const token = getCookie('token') as string | undefined;
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response: UrlPageResponse = await api<UrlPageResponse>(
        `/urls?page=${currentPage}&size=${itemsPerPage}&sortBy=createdAt&sortDir=desc`,
        { method: 'GET', token }
      );
      setUrls(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      const errorMessage = formatApiError(err, 'Failed to fetch URLs.');
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUrls();
  }, [currentPage]);

  const filteredUrls = urls.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (shortCode: string) => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api').replace('/api', '');
    navigator.clipboard.writeText(`${baseUrl}/r/${shortCode}`);
    showToast(`Copied ${baseUrl}/r/${shortCode} to clipboard!`, 'success');
  };

  const handleDelete = (shortCode: string) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    const token = getCookie('token') as string | undefined;
    if (!token) return;

    api<void>(`/urls/${shortCode}`, { method: 'DELETE', token })
      .then(() => {
        showToast('URL deleted.', 'info');
        fetchUrls();
      })
      .catch(() => showToast('Failed to delete URL.', 'error'));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>My URLs</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search URLs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            width: '100%',
            maxWidth: '400px',
          }}
        />
      </div>

      {loading ? (
        <p>Loading URLs...</p>
      ) : error ? (
        <p style={{ color: '#dc2626', textAlign: 'center', padding: '2rem' }}>{error}</p>
      ) : urls.length === 0 && searchTerm === '' ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Data not found.</p>
          <p>Shorten your first URL from the <Link href="/dashboard" style={{ color: '#2563eb' }}>Dashboard</Link>.</p>
        </div>
      ) : filteredUrls.length === 0 ? (
        <p>Data not found.</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Short URL</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Original URL</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Clicks</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Created</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((url) => (
                  <tr key={url.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link href={`/r/${url.shortCode}`} target="_blank" style={{ color: '#2563eb', textDecoration: 'none' }}>
                        /r/{url.shortCode}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Link href={url.originalUrl} target="_blank" style={{ color: '#6b7280', textDecoration: 'none' }}>
                        {url.originalUrl}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{url.totalClicks}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleCopy(url.shortCode)} title="Copy" style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}>
                          <MdContentCopy size={18} />
                        </button>
                        <Link href={`/dashboard/analytics/${url.shortCode}`} title="Analytics" style={{ padding: '0.25rem', color: '#059669', textDecoration: 'none' }}>
                          <MdOutlineAnalytics size={18} />
                        </Link>
                        <button onClick={() => handleDelete(url.shortCode)} title="Delete" style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    background: currentPage === i ? '#2563eb' : '#fff',
                    color: currentPage === i ? '#fff' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyUrlsPage;
