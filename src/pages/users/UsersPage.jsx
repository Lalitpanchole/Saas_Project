/**
 * Users Management Page
 * 
 * Comprehensive personnel management dashboard featuring pagination, role/status filters,
 * administrative password resets, and direct access to override permissions.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { usePermissions } from '../../hooks/usePermissions';
import UserFormModal from './UserFormModal';
import UserOverridesModal from './UserOverridesModal';
import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaUserShield,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';

export const UsersPage = () => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [roleId, setRoleId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [overridesModalOpen, setOverridesModalOpen] = useState(false);
  const [selectedUserForOverrides, setSelectedUserForOverrides] = useState(null);

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get('/roles');
      if (res.data?.success) {
        setRoles(res.data.data || []);
      }
    } catch (e) {
      console.warn('Could not fetch roles list');
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (roleId) params.append('roleId', roleId);
      if (status) params.append('status', status);

      const res = await apiClient.get(`/users?${params.toString()}`);
      if (res.data?.success) {
        const usersList = Array.isArray(res.data.data) ? res.data.data : res.data.data?.users || [];
        const totalCount = res.data.pagination?.total ?? res.data.data?.pagination?.total ?? 0;
        setUsers(usersList);
        setTotal(totalCount);
      }
    } catch (err) {
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleId, status]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setSelectedUserForEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUserForEdit(user);
    setFormModalOpen(true);
  };

  const handleOpenOverrides = (user) => {
    setSelectedUserForOverrides(user);
    setOverridesModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName || ''}"?`)) {
      return;
    }
    try {
      await apiClient.delete(`/users/${user.id}`);
      toast.success(`User deleted successfully.`);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user.';
      toast.error(msg);
    }
  };

  const handleResetPassword = async (user) => {
    const newPass = window.prompt(`Enter new password for ${user.firstName} (min 8 chars, 1 uppercase, 1 number, 1 symbol):`, 'Welcome@123!');
    if (!newPass) return;

    try {
      await apiClient.post(`/users/${user.id}/reset-password`, { newPassword });
      toast.success(`Password updated for ${user.firstName}. All active sessions revoked.`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset failed.';
      toast.error(msg);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Personnel Directory (`Users`)</h4>
          <p className="text-muted small mb-0">Manage system users, assigned role tiers, and individual override rules.</p>
        </div>

        {canCreate('users') && (
          <button onClick={handleOpenCreate} className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 align-self-md-start btn-mobile-full">
            <FaUserPlus />
            <span>Add New User</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="premium-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-4 d-flex gap-2">
            <select
              className="form-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Canvas */}
      <div className="premium-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Loading user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-bold text-dark">No users found</h6>
            <p className="text-muted small">Try modifying your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3">User & Contact</th>
                    <th className="py-3">Role Tier</th>
                    <th className="py-3">Account Status</th>
                    <th className="py-3">Created At</th>
                    <th className="text-end px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                            style={{ width: 'clamp(32px, 10vw, 40px)', height: 'clamp(32px, 10vw, 40px)' }}
                          >
                            {user.profileImageUrl ? (
                              <img src={user.profileImageUrl} alt="user" className="rounded-circle w-100 h-100 object-fit-cover" />
                            ) : (
                              user.firstName ? user.firstName[0].toUpperCase() : 'U'
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {user.firstName} {user.lastName || ''}
                            </div>
                            <div className="text-muted small">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-role badge-${user.role?.slug || 'default'}`}>
                          {user.role?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        {user.isActive ? (
                          <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1 d-inline-flex align-items-center gap-1">
                            <FaCheckCircle /> Active
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 px-2 py-1 d-inline-flex align-items-center gap-1">
                            <FaTimesCircle /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-muted small">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-end px-4">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {canUpdate('users') && (
                            <>
                              <button
                                onClick={() => handleOpenOverrides(user)}
                                className="btn btn-sm btn-outline-warning text-dark d-inline-flex align-items-center gap-1"
                                title="Permission Overrides"
                              >
                                <FaUserShield />
                                <span className="d-none d-lg-inline">Overrides</span>
                              </button>

                              <button
                                onClick={() => handleResetPassword(user)}
                                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                                title="Admin Password Reset"
                              >
                                <FaKey />
                              </button>

                              <button
                                onClick={() => handleOpenEdit(user)}
                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                                title="Edit User"
                              >
                                <FaEdit />
                              </button>
                            </>
                          )}

                          {canDelete('users') && (
                            <button
                              onClick={() => handleDelete(user)}
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                              title="Delete User"
                            >
                              <FaTrashAlt />
                            </button>
                          )}
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
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total users)
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

      {/* Modals */}
      <UserFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSaved={fetchUsers}
        userToEdit={selectedUserForEdit}
        roles={roles}
      />

      <UserOverridesModal
        isOpen={overridesModalOpen}
        onClose={() => setOverridesModalOpen(false)}
        user={selectedUserForOverrides}
      />
    </div>
  );
};

export default UsersPage;
