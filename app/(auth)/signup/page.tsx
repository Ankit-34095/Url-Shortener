'use client';

import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import styles from './page.module.css';

const SignupPage = () => {
  return (
    <div className={styles.signupPageContainer}>
      <AuthForm type="signup" />
    </div>
  );
};

export default SignupPage;
