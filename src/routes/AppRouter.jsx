/**
 * Application Router
 * 
 * Maps public authentication screens and RBAC protected dashboard routes.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Dashboard & Administration Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RolesPage from '../pages/roles/RolesPage';
import MenusPage from '../pages/menus/MenusPage';
import PermissionsPage from '../pages/permissions/PermissionsPage';
import ActivityLogsPage from '../pages/activityLogs/ActivityLogsPage';
import ThemeSettingsPage from '../pages/settings/ThemeSettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';

// Sample Business Pages
import ClientsPage from '../pages/clients/ClientsPage';
import StaffPage from '../pages/staff/StaffPage';
import ReportsPage from '../pages/reports/ReportsPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Module-level guarded routes */}
          <Route element={<ProtectedRoute requiredModule="users" />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="roles" />}>
            <Route path="/roles" element={<RolesPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="menus" />}>
            <Route path="/menus" element={<MenusPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="permissions" />}>
            <Route path="/permissions" element={<PermissionsPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="activity_logs" />}>
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="settings" />}>
            <Route path="/settings" element={<ThemeSettingsPage />} />
          </Route>

          {/* Sample Business Modules */}
          <Route element={<ProtectedRoute requiredModule="clients" />}>
            <Route path="/clients" element={<ClientsPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="staff" />}>
            <Route path="/staff" element={<StaffPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredModule="reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
