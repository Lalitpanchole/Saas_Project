/**
 * Protected Route Guard
 * 
 * Verifies active session state and evaluates required module permission before rendering.
 * References:
 *   - ARCHITECTURE.md §9 (Route protection)
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

export const ProtectedRoute = ({ requiredModule }) => {
  const { isAuthenticated, loading } = useAuth();
  const { canView } = usePermissions();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !canView(requiredModule)) {
    return (
      <div className="premium-card text-center py-5 my-5 max-w-lg mx-auto">
        <h4 className="fw-bold text-danger mb-3">Access Denied</h4>
        <p className="text-muted mb-4">
          You do not have permission (`canView`) to access the **{requiredModule}** module.
        </p>
        <a href="/" className="btn btn-primary-custom">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
