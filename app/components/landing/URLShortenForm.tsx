'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/shared/Toast';
import styles from './URLShortenForm.module.css';

interface URLShortenFormProps {
  onShorten?: (shortUrl: string | null) => void;
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (longUrl.includes('invalid')) {
      setError('Invalid URL provided. Please try again.');
      showToast('Invalid URL provided.', 'error');
    } else {
      const mockShortUrl = `http://short.url/${Math.random().toString(36).substring(2, 8)}`;
      setShortenedUrl(mockShortUrl);
      showToast('URL shortened successfully!', 'success');
      if (onShorten) {
        onShorten(mockShortUrl);
      }
    }
    setLoading(false);
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
