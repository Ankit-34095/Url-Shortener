import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'blue' }) => {
  const sizeClass = styles[size];
  const colorClass = styles[color];

  return (
    <div className={`${styles.spinner} ${sizeClass} ${colorClass}`}></div>
  );
};

export default LoadingSpinner;
