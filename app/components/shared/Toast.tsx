'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import styles from './Toast.module.css';

const ToastContext = createContext<((message: string, type?: 'info' | 'success' | 'error' | 'warning', duration?: number) => void) | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false); // New state for client-side mounting

  useEffect(() => {
    setMounted(true);
    // Ensure modal-root exists on the client side
    if (!document.getElementById('modal-root')) {
      const div = document.createElement('div');
      div.id = 'modal-root';
      document.body.appendChild(div);
    }
    return () => setMounted(false);
  }, []);

  const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  const contextValue = React.useMemo(() => showToast, [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted && ReactDOM.createPortal(
        <div className={styles.toastContainer}>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} message={toast.message} type={toast.type} />
          ))}
        </div>,
        document.getElementById('modal-root') || document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastItemProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const ToastItem: React.FC<ToastItemProps> = ({ message, type }) => {
  let bgColorClass = '';
  let borderColorClass = '';
  let textColorClass = '';

  switch (type) {
    case 'success':
      bgColorClass = styles.successBg;
      borderColorClass = styles.successBorder;
      textColorClass = styles.successText;
      break;
    case 'error':
      bgColorClass = styles.errorBg;
      borderColorClass = styles.errorBorder;
      textColorClass = styles.errorText;
      break;
    case 'warning':
      bgColorClass = styles.warningBg;
      borderColorClass = styles.warningBorder;
      textColorClass = styles.warningText;
      break;
    case 'info':
    default:
      bgColorClass = styles.infoBg;
      borderColorClass = styles.infoBorder;
      textColorClass = styles.infoText;
  }

  return (
    <div className={`${styles.toastItem} ${bgColorClass} ${borderColorClass} ${textColorClass}`}>
      {message}
    </div>
  );
};
