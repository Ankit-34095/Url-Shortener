'use client';

import React from 'react';
import Link from 'next/link';
import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>
          Ready to Shorten Your Links?
        </h2>
        <p className={styles.ctaDescription}>
          Join thousands of satisfied users and start optimizing your links today.
        </p>
        <Link 
          href="/signup" 
          className={styles.ctaButton}
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
