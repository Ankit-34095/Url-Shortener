'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faChartLine, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './FeaturesGrid.module.css';

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  style?: React.CSSProperties;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, style }) => (
  <div className={styles.featureCard} style={style}>
    <div className={styles.featureIcon}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDescription}>{description}</p>
  </div>
);

const FeaturesGrid = () => {
  const features = [
    {
      icon: faGem,
      title: 'Free Forever',
      description: 'Enjoy powerful URL shortening and tracking without any cost. No hidden fees, no credit card required.',
    },
    {
      icon: faChartLine,
      title: 'Detailed Analytics',
      description: 'Gain insights into your links with comprehensive click data, geographic breakdowns, and referrer information.',
    },
    {
      icon: faShareAlt,
      title: 'Easy Sharing',
      description: 'Share your shortened links effortlessly across all platforms, from social media to email campaigns.',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContent}>
        <h2 className={styles.sectionTitle}>
          Why Choose Our URL Shortener?
        </h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              style={{ animationDelay: `${0.2 * index}s` }} // Staggered animation
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
