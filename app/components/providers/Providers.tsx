'use client';

import React from 'react';
import { ToastProvider } from '@/components/shared/Toast';
import { AuthProvider } from '@/lib/auth-context';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
