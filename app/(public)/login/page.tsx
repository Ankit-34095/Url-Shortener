'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/lib/auth-context';
import styles from './page.module.css';

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.loginPageContainer}>
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
