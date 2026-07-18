/**
 * Authentication Layout
 * 
 * Sleek split-screen design with dynamic gradient and glass card wrapper for Login/Reset screens.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const AuthLayout = () => {
  const { theme } = useTheme();

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center p-3 p-md-4 w-100">
      <div className="auth-card">
        <div className="text-center mb-4">
          {theme.logoUrl && (
            <img src={theme.logoUrl} alt="logo" className="mb-3" style={{ maxHeight: 48 }} />
          )}
          <h3 className="fw-bold text-dark">{theme.appName || 'RBAC Starter'}</h3>
          <p className="text-muted small">Modular Monolith Reusable Administration</p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
