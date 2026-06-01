'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/shared/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const showToast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('If an account with that email exists, a reset link has been sent.', 'success');
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Check Your Email</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link.
          </p>
          <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Forgot Password?</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Send Reset Link
          </button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
