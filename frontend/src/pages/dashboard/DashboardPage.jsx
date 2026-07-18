/**
 * Dashboard Overview Screen
 * 
 * High-impact statistical overview showing live system summaries, authority badges,
 * quick navigation links, and recent administration highlights.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import apiClient from '../../api/apiClient';
import {
  FaUsers,
  FaUserShield,
  FaList,
  FaKey,
  FaCheckCircle,
  FaShieldAlt,
  FaArrowRight,
  FaUserTie,
  FaBriefcase,
  FaChartBar,
} from 'react-icons/fa';

export const DashboardPage = () => {
  const { user, role, isSuperAdmin } = useAuth();
  const { theme } = useTheme();
  const { canView } = usePermissions();
  const [stats, setStats] = useState({
    usersCount: 0,
    rolesCount: 0,
    menusCount: 0,
    loading: true,
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [usersRes, rolesRes, menusRes] = await Promise.allSettled([
          apiClient.get('/users?limit=1'),
          apiClient.get('/roles'),
          apiClient.get('/menus'),
        ]);

        setStats({
          usersCount: usersRes.status === 'fulfilled' && usersRes.value.data?.success ? usersRes.value.data.data.pagination?.total || 0 : 0,
          rolesCount: rolesRes.status === 'fulfilled' && rolesRes.value.data?.success ? rolesRes.value.data.data.length || 0 : 0,
          menusCount: menusRes.status === 'fulfilled' && menusRes.value.data?.success ? menusRes.value.data.data.length || 0 : 0,
          loading: false,
        });
      } catch (e) {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    loadSummary();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="premium-card mb-4 bg-primary bg-opacity-10 border-0 position-relative overflow-hidden p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-white px-3 py-1 rounded-pill small fw-semibold">
                {role?.name || role?.slug}
              </span>
              {isSuperAdmin && (
                <span className="badge bg-danger text-white px-2 py-1 rounded-pill small d-flex align-items-center gap-1">
                  <FaShieldAlt /> Unrestricted Authority
                </span>
              )}
            </div>
            <h3 className="fw-bold text-dark mb-1">
              Welcome back, {user?.firstName} {user?.lastName || ''}! 👋
            </h3>
            <p className="text-muted mb-0 small">
              You are accessing the <strong>{theme.appName}</strong> administration dashboard. All actions are logged.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/profile" className="btn btn-light border px-4 py-2 rounded-pill fw-medium small shadow-sm">
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
          <div className="premium-card stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">Total Users</p>
              <h3 className="fw-bold mb-0 text-dark">
                {stats.loading ? <span className="placeholder col-6"></span> : stats.usersCount}
              </h3>
            </div>
            <div className="p-3 bg-primary bg-opacity-10 rounded-3 text-primary fs-3 d-flex align-items-center justify-content-center">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
          <div className="premium-card stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">Roles & Tiers</p>
              <h3 className="fw-bold mb-0 text-dark">
                {stats.loading ? <span className="placeholder col-6"></span> : stats.rolesCount}
              </h3>
            </div>
            <div className="p-3 bg-warning bg-opacity-10 rounded-3 text-warning fs-3 d-flex align-items-center justify-content-center">
              <FaUserShield />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
          <div className="premium-card stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">Active Navigation</p>
              <h3 className="fw-bold mb-0 text-dark">
                {stats.loading ? <span className="placeholder col-6"></span> : stats.menusCount}
              </h3>
            </div>
            <div className="p-3 bg-info bg-opacity-10 rounded-3 text-info fs-3 d-flex align-items-center justify-content-center">
              <FaList />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
          <div className="premium-card stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">System Health</p>
              <div className="d-flex align-items-center gap-2 mt-1">
                <FaCheckCircle className="text-success fs-5" />
                <span className="fw-bold text-success">Operational</span>
              </div>
            </div>
            <div className="p-3 bg-success bg-opacity-10 rounded-3 text-success fs-3 d-flex align-items-center justify-content-center">
              <FaCheckCircle />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <h5 className="fw-bold mb-3 text-dark">Quick Administration & Modules</h5>
      <div className="row g-4">
        {canView('users') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-primary bg-opacity-10 rounded text-primary fs-4">
                    <FaUsers />
                  </div>
                  <h6 className="fw-bold mb-0 text-dark">User Management</h6>
                </div>
                <p className="text-muted small mb-4">
                  Add new personnel, assign system roles, override individual permissions, and perform administrative password resets.
                </p>
              </div>
              <Link to="/users" className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>Manage Users</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}

        {canView('roles') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-warning bg-opacity-10 rounded text-warning fs-4">
                    <FaUserShield />
                  </div>
                  <h6 className="fw-bold mb-0 text-dark">Role Management</h6>
                </div>
                <p className="text-muted small mb-4">
                  Create custom access tiers, configure default system roles, and assign menu permissions per tier.
                </p>
              </div>
              <Link to="/roles" className="btn btn-sm btn-outline-warning text-dark rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>Configure Roles</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}

        {canView('permissions') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-info bg-opacity-10 rounded text-info fs-4">
                    <FaKey />
                  </div>
                  <h6 className="fw-bold mb-0 text-dark">Permission Matrix</h6>
                </div>
                <p className="text-muted small mb-4">
                  Global matrix to inspect and batch-update granular permissions (View, Create, Update, Delete) across all roles and menus.
                </p>
              </div>
              <Link to="/permissions" className="btn btn-sm btn-outline-info text-dark rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>Open Matrix</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}

        {/* Sample Business Modules */}
        {canView('clients') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between border-primary border-opacity-25">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-success bg-opacity-10 rounded text-success fs-4">
                    <FaBriefcase />
                  </div>
                  <div>
                    <span className="badge bg-success-subtle text-success small mb-1">Business Module</span>
                    <h6 className="fw-bold mb-0 text-dark">Client Accounts</h6>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Manage external client accounts, contracts, and onboarding pipelines protected by standard CRUD permissions.
                </p>
              </div>
              <Link to="/clients" className="btn btn-sm btn-outline-success rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>View Clients</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}

        {canView('staff') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between border-primary border-opacity-25">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-secondary bg-opacity-10 rounded text-secondary fs-4">
                    <FaUserTie />
                  </div>
                  <div>
                    <span className="badge bg-secondary-subtle text-secondary small mb-1">Business Module</span>
                    <h6 className="fw-bold mb-0 text-dark">Staff & Contractors</h6>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Organize internal staff directory, contractor agreements, and department roles with fine-grained access checks.
                </p>
              </div>
              <Link to="/staff" className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>View Staff</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}

        {canView('reports') && (
          <div className="col-12 col-md-6 col-lg-4">
            <div className="premium-card h-100 d-flex flex-column justify-content-between border-primary border-opacity-25">
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-danger bg-opacity-10 rounded text-danger fs-4">
                    <FaChartBar />
                  </div>
                  <div>
                    <span className="badge bg-danger-subtle text-danger small mb-1">Business Module</span>
                    <h6 className="fw-bold mb-0 text-dark">Analytics & Reports</h6>
                  </div>
                </div>
                <p className="text-muted small mb-4">
                  Review system usage telemetry, revenue breakdowns, and performance charts across all organizational units.
                </p>
              </div>
              <Link to="/reports" className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-2 align-self-md-start btn-mobile-full justify-content-center">
                <span>View Reports</span>
                <FaArrowRight className="small" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
