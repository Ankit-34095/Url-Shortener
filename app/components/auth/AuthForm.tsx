'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/shared/Toast';
import styles from './AuthForm.module.css';
import api, { formatApiError } from '@/lib/api';
import { setCookie } from 'cookies-next';
import { useAuth } from '@/lib/auth-context';

interface AuthFormProps {
  type: 'login' | 'signup';
}

interface LoginRequestDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponseDto {
  token: string;
  expiresIn: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserResponseDto {
  message?: string;
  userId?: number;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const showToast = useToast();
  const { refreshUser } = useAuth();

  const isLogin = type === 'login';

  const getCookieMaxAge = (expiresIn: number) => {
    return Math.max(0, Math.floor((expiresIn - Date.now()) / 1000));
  };

  const saveSession = async (response: LoginResponseDto, fallbackEmail: string, fallbackName?: string) => {
    setCookie('token', response.token, {
      maxAge: getCookieMaxAge(response.expiresIn),
      path: '/',
      sameSite: 'lax',
    });

    localStorage.setItem('authToken', response.token);

    const userName = [response.firstName, response.lastName].filter(Boolean).join(' ') || fallbackName || '';
    if (userName) {
      localStorage.setItem('userName', userName);
    }

    localStorage.setItem('userEmail', response.email || fallbackEmail);
    await refreshUser();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      try {
        const response: LoginResponseDto = await api<LoginResponseDto>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password, rememberMe } as LoginRequestDto),
        });
        await saveSession(response, email);
        showToast('Login successful!', 'success');
        router.replace('/dashboard');
      } catch (err: any) {
        const errorMessage = formatApiError(err, 'Login failed.');
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } else {
      if (password !== confirmPassword) {
        const errorMessage = 'Passwords do not match.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } else if (firstName && lastName && email && password) {
        try {
          const response: UserResponseDto = await api<UserResponseDto>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, firstName, lastName } as RegisterRequestDto),
          });
          const loginResponse = await api<LoginResponseDto>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, rememberMe: false } as LoginRequestDto),
          });
          await saveSession(loginResponse, email, [firstName, lastName].filter(Boolean).join(' '));
          showToast('Signup successful! You are logged in.', 'success');
          router.replace('/dashboard');
        } catch (err: any) {
          const errorMessage = formatApiError(err, 'Signup failed.');
          setError(errorMessage);
          showToast(errorMessage, 'error');
        }
      } else {
        const errorMessage = 'Please fill in all required fields.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          {!isLogin && (
            <div className={styles.nameRow}>
              <div>
                <label className={styles.formLabel} htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className={styles.formInput}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className={styles.formInput}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className={styles.formLabel} htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.formInput}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.formLabel} htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className={styles.formInput}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {isLogin ? (
            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className={styles.checkboxLabel}>Remember me</label>
              </div>
            </div>
          ) : null}

          {error && (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className={styles.signupPrompt}>
          {isLogin ? (
            <p>
              Don't have an account? <Link href="/signup" className={styles.signupLink}>Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link href="/login" className={styles.signupLink}>Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
