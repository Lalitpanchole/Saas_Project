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
        <div className="text-center mb-4 pb-2">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} alt="logo" className="mb-4" style={{ maxHeight: 40, borderRadius: 8 }} />
          ) : (
             <div className="mb-4 d-inline-flex align-items-center justify-content-center bg-dark text-white rounded-3 fw-bold" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
                {theme.appName ? theme.appName.charAt(0) : 'R'}
             </div>
          )}
          <h3 className="fw-bold mb-1" style={{ color: '#111827', fontSize: '1.5rem', letterSpacing: '-0.025em' }}>
            {theme.appName || 'RBAC Starter'}
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Modular Monolith Reusable Administration</p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
