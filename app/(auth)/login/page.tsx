'use client';

import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import styles from './page.module.css';

const LoginPage = () => {
  return (
    <div className={styles.loginPageContainer}>
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
