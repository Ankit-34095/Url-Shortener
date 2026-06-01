'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">URL Shortener</Link>
      </div>
      <nav>
        {isLoading ? null : isAuthenticated ? (
          <>
            <span className={styles.userEmail}>{user?.email}</span>
            <Link href="/dashboard" className={`${styles.navLink} ${styles.dashboardLink}`}>Dashboard</Link>
            <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className={`${styles.navLink} ${styles.loginLink}`}>Login</Link>
            <Link href="/signup" className={`${styles.navLink} ${styles.signupLink}`}>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
