'use client';

import React from 'react';
import Link from 'next/link'; // Use next/link
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">URL Shortener</Link>
      </div>
      <nav>
        <Link href="/login" className={`${styles.navLink} ${styles.loginLink}`}>Login</Link>
        <Link href="/signup" className={`${styles.navLink} ${styles.signupLink}`}>Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;
