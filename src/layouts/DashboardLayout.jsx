/**
 * Dashboard Layout
 * 
 * Provides responsive sidebar navigation filtered dynamically by user permissions,
 * top navigation bar with user profile actions, and main content canvas.
 */

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import * as Icons from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';

const ICON_MAP = {
  dashboard: <Icons.FaTachometerAlt />,
  users: <Icons.FaUsers />,
  roles: <Icons.FaUserShield />,
  menus: <Icons.FaList />,
  permissions: <Icons.FaKey />,
  activity_logs: <Icons.FaHistory />,
  settings: <Icons.FaPalette />,
  clients: <Icons.FaBriefcase />,
  staff: <Icons.FaUserTie />,
  reports: <Icons.FaChartBar />,
  documents: <Icons.FaFolder />,
};

const getMenuIcon = (menu) => {
  if (menu.icon && Icons[menu.icon]) {
    const DynamicIcon = Icons[menu.icon];
    return <DynamicIcon />;
  }
  if (ICON_MAP[menu.slug]) {
    return ICON_MAP[menu.slug];
  }
  return <Icons.FaList />;
};

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 992);
  const { user, role, menus, logout, isSuperAdmin } = useAuth();
  const { theme } = useTheme();
  const { canView } = usePermissions();
  const navigate = useNavigate();

  // Add resize listener to collapse sidebar when window shrinks below 992px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filter menus based on isVisible and can_view permission
  const filterMenus = (items = []) => {
    return items
      .filter((item) => {
        if (item.isVisible === false) return false;
        if (isSuperAdmin) return true;
        return canView(item.slug);
      })
      .map((item) => ({
        ...item,
        children: filterMenus(item.children || []),
      }));
  };

  const visibleMenus = filterMenus(menus || []);

  return (
    <div className="app-wrapper">
      {/* Mobile Backdrop when sidebar is open (`!collapsed`) on mobile */}
      {!collapsed && (
        <div className="sidebar-backdrop d-lg-none" onClick={() => setCollapsed(true)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : 'open'}`}>
        <div className="sidebar-header">
          {!collapsed ? (
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              {theme.logoUrl && (
                <img src={theme.logoUrl} alt="logo" style={{ height: 30, borderRadius: 6 }} />
              )}
              <span className="sidebar-logo-text text-truncate">{theme.appName || 'RBAC Starter'}</span>
            </div>
          ) : (
            <div className="mx-auto fw-bold text-white fs-5">
              {theme.appName ? theme.appName.charAt(0).toUpperCase() : 'R'}
            </div>
          )}
          <button
            className="btn btn-sm text-white-50 border-0 ms-auto d-none d-lg-flex align-items-center justify-content-center p-1 rounded-circle hover-bg-light-10"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ width: 32, height: 32 }}
          >
            {collapsed ? <Icons.FaBars /> : <Icons.FaTimes />}
          </button>
        </div>

        <nav className="sidebar-menu custom-scrollbar">
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end
            title={collapsed ? 'Dashboard' : ''}
            onClick={() => window.innerWidth < 992 && setCollapsed(true)}
          >
            <span className="sidebar-icon">{ICON_MAP.dashboard}</span>
            {!collapsed && <span className="text-truncate">Dashboard</span>}
          </NavLink>

          {visibleMenus.map((menu) => (
            <NavLink
              key={menu.id}
              to={menu.route}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? menu.name : ''}
              onClick={() => window.innerWidth < 992 && setCollapsed(true)}
            >
              <span className="sidebar-icon">{getMenuIcon(menu)}</span>
              {!collapsed && <span className="text-truncate">{menu.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-top border-light border-opacity-10 mt-auto">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: 'clamp(32px, 10vw, 40px)', height: 'clamp(32px, 10vw, 40px)' }}
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.firstName}
                  className="rounded-circle w-100 h-100 object-fit-cover"
                />
              ) : (
                <span>{(user?.firstName || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="fw-bold text-white small text-truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-white-50 small text-truncate" style={{ fontSize: '0.75rem' }}>
                  {user?.email}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Navigation Bar */}
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="btn btn-light border d-flex align-items-center justify-content-center shadow-sm rounded-circle"
              style={{ width: 'clamp(32px, 10vw, 40px)', height: 'clamp(32px, 10vw, 40px)' }}
              title={collapsed ? 'Open Sidebar (Menu)' : 'Close Sidebar (Menu)'}
            >
              {collapsed ? <Icons.FaBars className="text-primary fs-5" /> : <Icons.FaTimes className="text-danger fs-5" />}
            </button>
            <h5 className="mb-0 fw-bold text-dark d-none d-sm-block text-truncate" style={{ maxWidth: '40vw' }}>{theme.appName} Administration</h5>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3 flex-mobile-wrap justify-content-end">
            <span className={`badge-role badge-${role?.slug || 'default'}`}>
              {role?.name || role?.slug}
            </span>

            <button
              onClick={() => navigate('/profile')}
              className="btn btn-light border d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm hover-lift"
              title="My Profile"
            >
              <Icons.FaUser className="text-secondary" />
              <span className="fw-medium small d-none d-sm-inline">{user?.firstName}</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-3 py-1 shadow-sm hover-lift"
              title="Log out"
            >
              <Icons.FaSignOutAlt />
              <span className="d-none d-sm-inline small fw-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Canvas */}
        <div className="p-2 p-md-4 flex-grow-1 w-100 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
