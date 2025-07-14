'use client';

import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClass = styles[size];

  return (
    <img 
      src={src}
      alt={alt}
      className={`${styles.avatar} ${sizeClass} ${className}`}
    />
  );
};

export default Avatar;
