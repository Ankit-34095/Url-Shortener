'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useToast } from '@/components/shared/Toast';
import styles from './QuickShortenForm.module.css';
import api, { formatApiError } from '@/lib/api';
import { getCookie } from 'cookies-next';

interface QuickShortenFormProps {
  onShorten: (url: { shortCode: string; shortUrl: string; originalUrl: string; }) => void;
}

interface CreateUrlRequestDto {
  originalUrl: string;
  customCode?: string;
  title?: string;
  description?: string;
  expiresAt?: string;
}

interface UrlResponseDto {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

const QuickShortenForm: React.FC<QuickShortenFormProps> = ({ onShorten }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!longUrl) {
      showToast('Please enter a long URL.', 'error');
      setLoading(false);
      return;
    }

    const token = getCookie('token') as string | undefined;
    if (!token) {
      showToast('You must be logged in to shorten URLs.', 'error');
      setLoading(false);
      return;
    }

    try {
      const requestBody: CreateUrlRequestDto = {
        originalUrl: longUrl,
        ...(customAlias && { customCode: customAlias }),
        // title and description are not in the current form, but can be added
        ...(expirationDate && { expiresAt: expirationDate.toISOString() }),
      };

      const response: UrlResponseDto = await api<UrlResponseDto>('/shorten', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        token: token,
      });

      onShorten(response);
      showToast(`URL shortened successfully! Short Code: ${response.shortCode}`, 'success');
      setLongUrl('');
      setCustomAlias('');
      setExpirationDate(null);

    } catch (err: any) {
      const errorMessage = formatApiError(err, 'Failed to shorten URL.');
      showToast(errorMessage, 'error');
    }

    setLoading(false);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Quick Shorten</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="longUrl" className={styles.label}>Long URL</label>
          <input
            type="url"
            id="longUrl"
            className={styles.inputField}
            placeholder="https://example.com/very/long/url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={styles.advancedToggle}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {showAdvanced && (
          <div className={styles.advancedOptions}>
            <div>
              <label htmlFor="customAlias" className={styles.label}>Custom Alias (Optional)</label>
              <input
                type="text"
                id="customAlias"
                className={styles.inputField}
                placeholder="my-awesome-link"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="expirationDate" className={styles.label}>Expiration Date (Optional)</label>
              <DatePicker
                id="expirationDate"
                selected={expirationDate}
                onChange={(date: Date | null) => setExpirationDate(date)}
                dateFormat="yyyy/MM/dd"
                minDate={new Date()}
                className={styles.inputField}
                placeholderText="Select a date"
              />
            </div>


          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default QuickShortenForm;
