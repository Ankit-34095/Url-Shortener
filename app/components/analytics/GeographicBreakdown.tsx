import React from 'react';
import Table from '@/components/shared/Table';
import styles from './GeographicBreakdown.module.css';

interface GeographicData {
  country: string;
  clicks: number;
}

interface GeographicBreakdownProps {
  data: GeographicData[];
}

const GeographicBreakdown: React.FC<GeographicBreakdownProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No geographic data available.</div>;
  }

  return (
    <Table>
      <thead className={styles.tableHead}>
        <tr>
          <th className={styles.tableHeader}>Country</th>
          <th className={styles.tableHeader}>Clicks</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {data.map((geo, index) => (
          <tr key={index} className={styles.tableRow}>
            <td className={`${styles.tableData} ${styles.countryName}`}>{geo.country}</td>
            <td className={`${styles.tableData} ${styles.clicks}`}>{geo.clicks}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default GeographicBreakdown;
