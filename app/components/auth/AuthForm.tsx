'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/shared/Toast';
import styles from './AuthForm.module.css';
import api from '@/app/lib/api'; // Import the API utility
import { setCookie } from 'cookies-next';

interface AuthFormProps {
  type: 'login' | 'signup';
}

interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponseDto {
  accessToken: string;
  tokenType: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const showToast = useToast();

  const isLogin = type === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isLogin) {
      try {
        const response: LoginResponseDto = await api<LoginResponseDto>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password } as LoginRequestDto),
        });
        setCookie('token', response.accessToken, { maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined }); // 7 days if rememberMe
        showToast('Login successful!', 'success');
        router.push('/dashboard');
      } catch (err: any) {
        const errorMessage = err.message || 'Login failed.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } else { // Signup
      if (password !== confirmPassword) {
        const errorMessage = 'Passwords do not match.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } else if (!termsAccepted) {
        const errorMessage = 'You must accept the terms and conditions.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } else if (fullName && email && password) {
        // Split full name into first and last name
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        try {
          const response: UserResponseDto = await api<UserResponseDto>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, firstName, lastName } as RegisterRequestDto),
          });
          console.log('Signup successful', response);
          showToast('Signup successful!', 'success');
          router.push('/login'); // Redirect to login page after successful signup
        } catch (err: any) {
          const errorMessage = err.message || 'Signup failed.';
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
            <div>
              <label className={styles.formLabel} htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                className={styles.formInput}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
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
                required={!isLogin}
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
              <Link href="/forgot-password" className={styles.forgotPasswordLink}>Forgot password?</Link>
            </div>
          ) : (
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="termsAccepted"
                className={styles.checkbox}
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="termsAccepted" className={styles.termsLabel}>I agree to the <Link href="/terms" className={styles.termsLink}>Terms and Conditions</Link></label>
            </div>
          )}

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

        {/* Optional: Social Login Buttons */}
        <div className={styles.socialLoginContainer}>
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Or</span>
            <div className={styles.dividerLine}></div>
          </div>
          <button
            className={styles.googleButton}
          >
            <img src="/google-icon.svg" alt="Google" className={styles.googleIcon} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
