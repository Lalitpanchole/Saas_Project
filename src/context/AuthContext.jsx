/**
 * Authentication Context Provider
 * 
 * Manages user session state, login/logout transitions, and session restoration.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient, { setAccessToken } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasRestoredRef = useRef(false);

  const restoreSession = useCallback(async () => {
    try {
      // First try calling refresh if we have or don't have token in memory
      const resRefresh = await apiClient.post('/auth/refresh');
      if (resRefresh.data?.success) {
        setAccessToken(resRefresh.data.data.accessToken);
        const resMe = await apiClient.get('/auth/me');
        if (resMe.data?.success) {
          const { user: u, role: r, permissions: p, menus: m } = resMe.data.data;
          setUser(u);
          setRole(r);
          setPermissions(p || []);
          setMenus(m || []);
        }
      }
    } catch (err) {
      setUser(null);
      setRole(null);
      setPermissions([]);
      setMenus([]);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true;
      restoreSession();
    }

    const handleSessionExpired = () => {
      setUser(null);
      setRole(null);
      setPermissions([]);
      setMenus([]);
      setAccessToken(null);
    };

    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session_expired', handleSessionExpired);
  }, [restoreSession]);

  const login = async (email, password, rememberMe, recaptchaToken) => {
    const res = await apiClient.post('/auth/login', { email, password, rememberMe, recaptchaToken });
    if (res.data?.success) {
      const { accessToken, user: u, role: r, permissions: p, menus: m } = res.data.data;
      setAccessToken(accessToken);
      setUser(u);
      setRole(r);
      setPermissions(p || []);
      setMenus(m || []);
      return res.data;
    }
  };

  const googleLogin = async (googleToken) => {
    const res = await apiClient.post('/auth/google', { googleToken });
    if (res.data?.success) {
      const { accessToken, user: u, role: r, permissions: p, menus: m } = res.data.data;
      setAccessToken(accessToken);
      setUser(u);
      setRole(r);
      setPermissions(p || []);
      setMenus(m || []);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn('Logout error:', e);
    } finally {
      setAccessToken(null);
      setUser(null);
      setRole(null);
      setPermissions([]);
      setMenus([]);
    }
  };

  const updateUserInfo = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        menus,
        loading,
        isAuthenticated: Boolean(user),
        isSuperAdmin: role?.slug === 'super_admin',
        login,
        googleLogin,
        logout,
        restoreSession,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
