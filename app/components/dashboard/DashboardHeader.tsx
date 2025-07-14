import React from 'react';
import Avatar from '@/components/shared/Avatar';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  // No props needed for now, using mock data internally
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  // Mock user data and stats
  const user = { name: 'John Doe', avatar: 'https://via.placeholder.com/40' };
  const stats = { totalUrls: 15, totalClicks: 1245 };

  return (
    <div className={styles.dashboardHeader}>
      <div className={styles.userInfo}>
        <Avatar src={user.avatar} alt="User Avatar" size="md" className={styles.avatarMargin} />
        <h1 className={styles.welcomeText}>Welcome back, {user.name}!</h1>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>Total URLs</p>
          <p className={`${styles.statValue} ${styles.blueText}`}>{stats.totalUrls}</p>
        </div>
        <div className={styles.statItem}>
          <p className={styles.statLabel}>Total Clicks</p>
          <p className={`${styles.statValue} ${styles.greenText}`}>{stats.totalClicks}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
