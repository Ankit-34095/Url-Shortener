import React from 'react';
import Table from '@/components/shared/Table';
import styles from './RecentActivity.module.css';

interface RecentActivityData {
  timestamp: string;
  source: string;
  location: string;
}

interface RecentActivityProps {
  data: RecentActivityData[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No recent activity data available.</div>;
  }

  return (
    <Table>
      <thead className={styles.tableHead}>
        <tr>
          <th className={styles.tableHeader}>Timestamp</th>
          <th className={styles.tableHeader}>Source</th>
          <th className={styles.tableHeader}>Location</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {data.map((activity, index) => (
          <tr key={index} className={styles.tableRow}>
            <td className={`${styles.tableData} ${styles.timestamp}`}>{activity.timestamp}</td>
            <td className={`${styles.tableData} ${styles.source}`}>{activity.source}</td>
            <td className={`${styles.tableData} ${styles.location}`}>{activity.location}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default RecentActivity;
