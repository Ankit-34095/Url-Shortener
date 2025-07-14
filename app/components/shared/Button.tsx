'use client';

import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', className = '', variant = 'primary', disabled = false, ...props }) => {
  
  const variantStyles = styles[variant];
  const disabledStyles = disabled ? styles.disabled : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
