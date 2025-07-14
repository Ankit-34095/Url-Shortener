'use client';

import React from 'react';
import { ResponsiveContainer } from 'recharts';
import styles from './Chart.module.css';

interface ChartProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ children, width = "100%", height = 300, className = '' }) => {
  return (
    <div className={`${styles.chartContainer} ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
