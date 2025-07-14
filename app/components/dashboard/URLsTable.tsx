'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdContentCopy, MdOutlineAnalytics, MdEdit, MdDelete } from 'react-icons/md';
import { useToast } from '@/components/shared/Toast';
import styles from './URLsTable.module.css';
import api from '@/app/lib/api';
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
  number: number; // current page number (0-indexed)
  size: number;
}

interface URLsTableProps {
  // urls: URLItem[]; // No longer passed as prop, will be fetched internally
}

const URLsTable: React.FC<URLsTableProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Backend is 0-indexed
  const [itemsPerPage] = useState(5);
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const fetchUrls = async () => {
    setLoading(true);
    const token = getCookie('token');
    if (!token) {
      showToast('You must be logged in to view URLs.', 'error');
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
      const errorMessage = err.message || 'Failed to fetch URLs.';
      showToast(errorMessage, 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUrls();
  }, [currentPage]); // Refetch when currentPage changes

  const filteredUrls = urls.filter(
    (url) =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // No longer needed with backend pagination
  // const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredUrls.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber - 1); // Adjust for 0-indexed backend

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${shortUrl}`);
    showToast(`Copied ${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${shortUrl} to clipboard!`, 'success');
  };

  const handleDelete = (id: number, shortCode: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      const token = getCookie('token');
      if (!token) {
        showToast('You must be logged in to delete URLs.', 'error');
        return;
      }

      try {
        api<void>(`/urls/${shortCode}`, {
          method: 'DELETE',
          token: token,
        }).then(() => {
          showToast(`URL with short code ${shortCode} deleted.`, 'info');
          fetchUrls(); // Refresh the list after deletion
        });
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to delete URL.';
        showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div className={styles.tableCard}>
      <h2 className={styles.tableTitle}>My Shortened URLs</h2>

      {loading ? (
        <p>Loading URLs...</p>
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
            {/* Add filter/sort options here if needed */}
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
                      <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${url.shortCode}`} target="_blank" rel="noopener noreferrer">{`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${url.shortCode}`}</Link>
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
                      <button onClick={() => console.log('Edit', url.id)} className={`${styles.actionButton} ${styles.edit}`} title="Edit">
                        <MdEdit size={20} />
                      </button>
                      <button onClick={() => handleDelete(url.id, url.shortCode)} className={`${styles.actionButton} ${styles.delete}`} title="Delete">
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className={styles.mobileCardContainer}>
            {filteredUrls.map((url) => (
              <div key={url.id} className={styles.mobileCard}>
                <div className={styles.mobileCardHeader}>
                  <Link href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className={styles.mobileShortUrl}>
                    {`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '')}/${url.shortCode}`}
                  </Link>
                  <span className={styles.mobileDate}>{new Date(url.createdAt).toLocaleDateString()}</span>
                </div>
                <p className={styles.mobileOriginalUrl}><span className={styles.label}>Original:</span> <Link href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</Link></p>
                <p className={styles.mobileClicks}><span className={styles.label}>Clicks:</span> {url.totalClicks}</p>
                <div className={styles.mobileActions}>
                  <button onClick={() => handleCopy(url.shortCode)} className={styles.mobileActionButton}><MdContentCopy className={styles.iconMarginRight} /> Copy</button>
                  <Link href={`/dashboard/analytics/${url.shortCode}`} className={`${styles.mobileActionButton} ${styles.analytics}`}><MdOutlineAnalytics className={styles.iconMarginRight} /> Analytics</Link>
                  <button onClick={() => console.log('Edit', url.id)} className={`${styles.mobileActionButton} ${styles.edit}`}><MdEdit className={styles.iconMarginRight} /> Edit</button>
                  <button onClick={() => handleDelete(url.id, url.shortCode)} className={`${styles.mobileActionButton} ${styles.delete}`}><MdDelete className={styles.iconMarginRight} /> Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
