/**
 * Activity Logs & Audit Trail Page
 * 
 * Inspects system telemetry and administrative actions logged across all modules.
 * Features search filtering, module categorization, date filtering, and pagination.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import {
  FaHistory,
  FaSearch,
  FaUserShield,
  FaClock,
  FaDesktop,
} from 'react-icons/fa';

export const ActivityLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [moduleSlug, setModuleSlug] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (moduleSlug) params.append('moduleSlug', moduleSlug);

      const res = await apiClient.get(`/activity-logs?${params.toString()}`);
      if (res.data?.success) {
        setLogs(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      }
    } catch (err) {
      toast.error('Failed to query system activity logs.');
    } finally {
      setLoading(false);
    }
  }, [page, search, moduleSlug]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit) || 1;

  const renderModuleBadge = (mod) => {
    const colors = {
      users: 'primary',
      roles: 'warning',
      menus: 'info',
      permissions: 'danger',
      settings: 'secondary',
      profile: 'success',
    };
    const c = colors[mod] || 'dark';
    return <span className={`badge bg-${c}-subtle text-${c} border border-${c} border-opacity-25 px-2 py-1`}>{mod}</span>;
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">System Audit Trail (`Activity Logs`)</h4>
          <p className="text-muted small mb-0">Review administrative events, security changes, and user telemetry.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="premium-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-12 col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search logs by action description or user email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-12 col-md-5">
            <select
              className="form-select"
              value={moduleSlug}
              onChange={(e) => {
                setModuleSlug(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All System Modules</option>
              <option value="users">User Management (`users`)</option>
              <option value="roles">Role Management (`roles`)</option>
              <option value="menus">Menu Hierarchy (`menus`)</option>
              <option value="permissions">Permission Matrix (`permissions`)</option>
              <option value="settings">Theme Settings (`settings`)</option>
              <option value="profile">Profile Operations (`profile`)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="premium-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Retrieving audit telemetry...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-bold text-dark">No audit entries found</h6>
            <p className="text-muted small">No activity matches your selected filters.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="py-3">Actor (`User`)</th>
                    <th className="py-3">Action & Module</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Network IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-muted small text-nowrap">
                        <div className="d-flex align-items-center gap-1">
                          <FaClock className="small text-secondary" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        {log.user ? (
                          <div>
                            <span className="fw-semibold text-dark">
                              {log.user.firstName} {log.user.lastName || ''}
                            </span>
                            <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                              {log.user.email}
                            </small>
                          </div>
                        ) : (
                          <span className="badge bg-light text-secondary border">System / Guest</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {renderModuleBadge(log.module)}
                          <code className="text-dark fw-bold small">{log.action}</code>
                        </div>
                      </td>
                      <td className="text-dark small text-truncate" style={{ maxWidth: '40vw' }}>
                        {log.description || 'No additional notes recorded.'}
                      </td>
                      <td className="text-muted small font-monospace">
                        <div className="d-flex align-items-center gap-1" title={log.userAgent || 'unknown'}>
                          <FaDesktop className="small" />
                          <span>{log.ipAddress || '127.0.0.1'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-light border-top">
              <span className="small text-muted">
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total logs)
              </span>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogsPage;
