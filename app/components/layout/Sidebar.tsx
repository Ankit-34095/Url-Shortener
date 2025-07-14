'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'My URLs', href: '/dashboard/my-urls' }, // Assuming a sub-route for My URLs
    { name: 'Analytics', href: '/dashboard/analytics' }, // Analytics will have dynamic sub-routes
    { name: 'Profile/Settings', href: '/dashboard/profile' },
    { name: 'Logout', href: '/logout' }, // Assuming a logout route
  ];

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Navigation</h2>
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
    </aside>
  );
};

export default Sidebar;
