'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import URLShortenForm from '@/components/landing/URLShortenForm';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [guestShortenedUrl, setGuestShortenedUrl] = useState<string | null>(null);

  return (
    <section className={styles.heroSection}>
      {/* Background gradient and subtle shapes */}
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Shorten URLs. Track Performance. Share Smarter.
        </h1>
        <p className={styles.heroSubtitle}>
          Create short links with detailed analytics in seconds
        </p>

        <URLShortenForm onShorten={setGuestShortenedUrl} />

        {guestShortenedUrl && (
          <div className={styles.shortenedUrlContainer}>
            <h3 className={styles.shortenedUrlTitle}>Your URL is shortened!</h3>
            <p className={styles.shortenedUrlLink}>
              <a href={guestShortenedUrl} target="_blank" rel="noopener noreferrer">
                {guestShortenedUrl}
              </a>
            </p>
            <p className={styles.moreFeaturesText}>Want more features like analytics and custom aliases?</p>
            <Link 
              href="/signup" 
              className={styles.signupButton}
            >
              Sign Up for Free
            </Link>
          </div>
        )}

        <div className={styles.usersWorldwide}>
          Join 10,000+ users worldwide!
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
