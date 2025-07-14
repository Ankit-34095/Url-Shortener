import React from 'react';
import Table from '@/components/shared/Table';
import styles from './ReferrerTable.module.css';

interface ReferrerData {
  domain: string;
  clicks: number;
  percentage: string;
}

interface ReferrerTableProps {
  data: ReferrerData[];
}

const ReferrerTable: React.FC<ReferrerTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No referrer data available.</div>;
  }

  return (
    <Table>
      <thead className={styles.tableHead}>
        <tr>
          <th className={styles.tableHeader}>Domain</th>
          <th className={styles.tableHeader}>Clicks</th>
          <th className={styles.tableHeader}>Percentage</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {data.map((referrer, index) => (
          <tr key={index} className={styles.tableRow}>
            <td className={`${styles.tableData} ${styles.domainName}`}>{referrer.domain}</td>
            <td className={`${styles.tableData} ${styles.clicks}`}>{referrer.clicks}</td>
            <td className={`${styles.tableData} ${styles.percentage}`}>{referrer.percentage}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ReferrerTable;
