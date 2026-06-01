'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const parseJwt = (token: string) => {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  const clearSession = useCallback(() => {
    deleteCookie('token');
    deleteCookie('token', { path: '/' });
    deleteCookie('token', { path: '/login' });
    deleteCookie('token', { path: '/signup' });
    deleteCookie('token', { path: '/dashboard' });
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    const cookieToken = await Promise.resolve(getCookie('token'));
    const token = cookieToken || localStorage.getItem('authToken');
    if (token) {
      const payload = parseJwt(String(token));
      const expiresAt = payload?.exp ? payload.exp * 1000 : 0;
      if (!payload || expiresAt <= Date.now()) {
        clearSession();
        setIsLoading(false);
        return;
      }

      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const [firstName, ...lastNameParts] = (storedName || '').split(' ').filter(Boolean);
      localStorage.setItem('authToken', String(token));
      setIsAuthenticated(true);
      setUser({
        email: storedEmail || payload.sub || '',
        firstName,
        lastName: lastNameParts.join(' ') || undefined,
      });
    } else {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, [clearSession]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
