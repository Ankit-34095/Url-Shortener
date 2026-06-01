'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdContentCopy, MdOutlineAnalytics, MdDelete } from 'react-icons/md';
import { useToast } from '@/components/shared/Toast';
import styles from './URLsTable.module.css';
import api, { formatApiError } from '@/lib/api';
import { getCookie } from 'cookies-next';

interface URLItem {
  id: number;
  shortCode: string;
  originalUrl: string;
  title?: string;
  description?: string;
  totalClicks: number;
  createdAt: string;
  expiresAt?: string;
}

interface UrlPageResponse {
  content: URLItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface URLsTableProps {
  refreshKey?: number;
}

const URLsTable: React.FC<URLsTableProps> = ({ refreshKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useToast();

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
        {
          method: 'GET',
          token: token,
        }
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
  }, [currentPage, refreshKey]);

  const filteredUrls = urls.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber - 1);

  const handleCopy = (shortUrl: string) => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api').replace('/api', '');
    navigator.clipboard.writeText(`${baseUrl}/r/${shortUrl}`);
    showToast(`Copied ${baseUrl}/r/${shortUrl} to clipboard!`, 'success');
  };

  const handleDelete = (id: number, shortCode: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const token = getCookie('token') as string | undefined;
      if (!token) return;

      api<void>(`/urls/${shortCode}`, {
        method: 'DELETE',
        token: token,
      }).then(() => {
        showToast(`URL with short code ${shortCode} deleted.`, 'info');
        fetchUrls();
      }).catch(() => {
        showToast('Failed to delete URL.', 'error');
      });
    }
  };

  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api').replace('/api', '');

  return (
    <div className={styles.tableCard}>
      <h2 className={styles.tableTitle}>My Shortened URLs</h2>

      {loading ? (
        <p>Loading URLs...</p>
      ) : error ? (
        <p className={styles.emptyState}>{error}</p>
      ) : filteredUrls.length === 0 ? (
        <p className={styles.emptyState}>Data not found.</p>
      ) : (
        <>
          <div className={styles.controlsContainer}>
            <input
              type="text"
              placeholder="Search URLs..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.desktopTableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Short URL</th>
                  <th className={styles.tableHeader}>Original URL</th>
                  <th className={styles.tableHeader}>Clicks</th>
                  <th className={styles.tableHeader}>Created Date</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredUrls.map((url) => (
                  <tr key={url.id} className={styles.tableRow}>
                    <td className={`${styles.tableData} ${styles.shortUrl}`}>
                      <Link href={`${baseUrl}/r/${url.shortCode}`} target="_blank" rel="noopener noreferrer">{`${baseUrl}/r/${url.shortCode}`}</Link>
                    </td>
                    <td className={`${styles.tableData} ${styles.originalUrl}`}>
                      <Link href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</Link>
                    </td>
                    <td className={`${styles.tableData} ${styles.clicks}`}>{url.totalClicks}</td>
                    <td className={`${styles.tableData} ${styles.createdDate}`}>{new Date(url.createdAt).toLocaleDateString()}</td>
                    <td className={`${styles.tableData} ${styles.actions}`}>
                      <button onClick={() => handleCopy(url.shortCode)} className={styles.actionButton} title="Copy">
                        <MdContentCopy size={20} />
                      </button>
                      <Link href={`/dashboard/analytics/${url.shortCode}`} className={`${styles.actionButton} ${styles.analytics}`} title="View Analytics">
                        <MdOutlineAnalytics size={20} />
                      </Link>
                      <button onClick={() => handleDelete(url.id, url.shortCode)} className={`${styles.actionButton} ${styles.delete}`} title="Delete">
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileCardContainer}>
            {filteredUrls.map((url) => (
              <div key={url.id} className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <Link href={`${baseUrl}/r/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className={styles.mobileShortUrl}>
                    {`${baseUrl}/r/${url.shortCode}`}
                  </Link>
                  <span className={styles.mobileDate}>{new Date(url.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={styles.mobileOriginalUrl}><span className={styles.label}>Original:</span> <Link href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</Link></p>
                <p className={styles.mobileClicks}><span className={styles.label}>Clicks:</span> {url.totalClicks}</p>
                <div className={styles.mobileActions}>
                  <button onClick={() => handleCopy(url.shortCode)} className={styles.mobileActionButton}><MdContentCopy className={styles.iconMarginRight} /> Copy</button>
                  <Link href={`/dashboard/analytics/${url.shortCode}`} className={`${styles.mobileActionButton} ${styles.analytics}`}><MdOutlineAnalytics className={styles.iconMarginRight} /> Analytics</Link>
                  <button onClick={() => handleDelete(url.id, url.shortCode)} className={`${styles.mobileActionButton} ${styles.delete}`}><MdDelete className={styles.iconMarginRight} /> Delete</button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationContainer}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`${styles.paginationButton} ${
                    currentPage === i ? styles.active : ''
                  }`}
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

export default URLsTable;
