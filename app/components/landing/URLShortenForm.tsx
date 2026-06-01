'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import styles from './URLShortenForm.module.css';
import api, { formatApiError } from '@/lib/api';

interface URLShortenFormProps {
  onShorten?: (shortUrl: string | null) => void;
}

interface UrlResponseDto {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

const URLShortenForm: React.FC<URLShortenFormProps> = ({ onShorten }) => {
  const [longUrl, setLongUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showToast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShortenedUrl(null);

    try {
      const response = await api<UrlResponseDto>('/shorten/public', {
        method: 'POST',
        body: JSON.stringify({ originalUrl: longUrl }),
      });
      setShortenedUrl(response.shortUrl);
      showToast('URL shortened successfully!', 'success');
      if (onShorten) {
        onShorten(response.shortUrl);
      }
    } catch (err: any) {
      const errorMessage = formatApiError(err, 'Failed to shorten URL.');
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="url"
          placeholder="Enter your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className={styles.inputField}
          required
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten It!'}
        </button>
      </form>

      {shortenedUrl && (
        <div className={styles.shortenedUrlContainer}>
          <p>Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a></p>
          <button 
            onClick={() => navigator.clipboard.writeText(shortenedUrl)}
            className={styles.copyButton}
          >
            Copy
          </button>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default URLShortenForm;
