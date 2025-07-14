'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Chart from '@/components/shared/Chart';
import styles from './TimeSeriesChart.module.css';

interface TimeSeriesChartProps {
  data: { date: string; clicks: number }[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No data available for this period.</div>;
  }

  return (
    <Chart>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#2563eb" activeDot={{ r: 8 }} />
      </LineChart>
    </Chart>
  );
};

export default TimeSeriesChart;
