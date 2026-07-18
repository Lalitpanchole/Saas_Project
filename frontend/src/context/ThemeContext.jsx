/**
 * Theme Context Provider
 * 
 * Fetches application branding settings from /api/settings/theme and injects CSS variables.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    appName: 'RBAC Starter',
    logoUrl: null,
    faviconUrl: null,
    primaryColor: '#0d6efd',
    secondaryColor: '#6c757d',
    sidebarColor: '#0f172a',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    textColor: '#212529',
  });
  const [loading, setLoading] = useState(true);

  const fetchTheme = async () => {
    try {
      const res = await apiClient.get('/settings/theme');
      if (res.data?.success && res.data.data) {
        setTheme(res.data.data);
      }
    } catch (e) {
      console.warn('Could not fetch theme settings, using defaults.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }
    if (theme.sidebarColor) {
      document.documentElement.style.setProperty('--bg-sidebar', theme.sidebarColor);
    }
    if (theme.fontFamily) {
      document.documentElement.style.setProperty('--font-family', theme.fontFamily);
      document.body.style.fontFamily = theme.fontFamily;
    }
    if (theme.fontSize) {
      document.documentElement.style.setProperty('--font-size', theme.fontSize);
      document.body.style.fontSize = theme.fontSize;
    }
    if (theme.textColor) {
      document.documentElement.style.setProperty('--text-main', theme.textColor);
      document.body.style.color = theme.textColor;
    }
    if (theme.appName) {
      document.title = theme.appName;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fetchTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
