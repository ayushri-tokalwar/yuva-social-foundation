import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthApi } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ysf_admin_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ysf_admin_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('ysf_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await adminAuthApi.getMe();
        setUser(userData);
        localStorage.setItem('ysf_admin_user', JSON.stringify(userData));
        setToken(storedToken);
      } catch (err) {
        console.warn('Admin token verification failed:', err.message);
        localStorage.removeItem('ysf_admin_token');
        localStorage.removeItem('ysf_admin_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    verifyAuth();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await adminAuthApi.login(username, password);
      localStorage.setItem('ysf_admin_token', data.token);
      localStorage.setItem('ysf_admin_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await adminAuthApi.logout();
    } finally {
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        authError,
        login,
        logout,
        setAuthError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
