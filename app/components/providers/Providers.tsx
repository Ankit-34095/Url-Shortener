'use client';

import React from 'react';
import { ToastProvider } from '@/components/shared/Toast';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
};

export default Providers;
