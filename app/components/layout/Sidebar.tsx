'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My URLs', href: '/dashboard/my-urls' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Profile / Settings', href: '/dashboard/profile' },
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>URL Shortener</h2>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`${styles.navLink} ${
            pathname === link.href ? styles.active : ''
          }`}
        >
          {link.name}
        </Link>
      ))}
      <div className={styles.spacer} />
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
