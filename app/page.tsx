'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import CTASection from '@/components/landing/CTASection';
import styles from './page.module.css';

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <CTASection />
    </div>
  );
};

export default LandingPage;
