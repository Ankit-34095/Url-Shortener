'use client';

import React from 'react';
import ProfileForm from '@/components/profile/ProfileForm';
import AccountSettings from '@/components/profile/AccountSettings';
import styles from './page.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.profilePageContainer}>
      <h1 className={styles.pageTitle}>Profile & Settings</h1>
      <div className={styles.gridContainer}>
        <ProfileForm />
        <AccountSettings />
      </div>
    </div>
  );
};

export default ProfilePage;
