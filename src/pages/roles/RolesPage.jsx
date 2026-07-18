/**
 * Roles Management Page
 * 
 * Interface for configuring role tiers and checking assigned users counts.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { usePermissions } from '../../hooks/usePermissions';
import RoleFormModal from './RoleFormModal';
import RolePermissionMatrixModal from './RolePermissionMatrixModal';
import {
  FaUserShield,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaKey,
  FaLock,
} from 'react-icons/fa';

export const RolesPage = () => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await apiClient.get(`/roles?${params.toString()}`);
      if (res.data?.success) {
        setRoles(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load roles directory.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleOpenCreate = () => {
    setSelectedRoleForEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (role) => {
    setSelectedRoleForEdit(role);
    setFormModalOpen(true);
  };

  const handleOpenPermissions = (role) => {
    setSelectedRoleForPerms(role);
    setPermissionsModalOpen(true);
  };

  const handleDelete = async (role) => {
    if (role.isSystem) {
      toast.error('System roles cannot be deleted.');
      return;
    }
    if ((role._count?.users || 0) > 0) {
      toast.error(`Cannot delete role assigned to ${role._count.users} user(s). Reassign them first.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete custom role "${role.name}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/roles/${role.id}`);
      toast.success('Role deleted successfully.');
      fetchRoles();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete role.';
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Access Tiers & Roles (`Roles`)</h4>
          <p className="text-muted small mb-0">Create customizable tiers and bind default action rules to navigation items.</p>
        </div>

        {canCreate('roles') && (
          <button onClick={handleOpenCreate} className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 align-self-md-start btn-mobile-full mt-2 mt-sm-0">
            <FaPlus />
            <span>Create Custom Tier</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="premium-card mb-4 p-3">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search tiers by name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <div className="premium-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Loading roles structure...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-bold text-dark">No access tiers found</h6>
            <p className="text-muted small">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Role Tier Name</th>
                  <th className="py-3">Slug Identifier</th>
                  <th className="py-3">Classification</th>
                  <th className="py-3">Assigned Users</th>
                  <th className="py-3">Created At</th>
                  <th className="text-end px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <FaUserShield className="text-warning fs-5" />
                        <span className="fw-bold text-dark">{role.name}</span>
                      </div>
                    </td>
                    <td>
                      <code className="bg-light px-2 py-1 rounded text-dark border font-monospace">
                        {role.slug}
                      </code>
                    </td>
                    <td>
                      {role.isSystem ? (
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-25 px-2 py-1 d-inline-flex align-items-center gap-1">
                          <FaLock className="small" /> System Protected
                        </span>
                      ) : (
                        <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 px-2 py-1">
                          Custom Tier
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-3 py-1 fw-semibold">
                        {role._count?.users || 0} user(s)
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end px-4">
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        {canUpdate('roles') && (
                          <>
                            <button
                              onClick={() => handleOpenPermissions(role)}
                              className="btn btn-sm btn-outline-info text-dark d-inline-flex align-items-center gap-1"
                              title="Configure Menu Permissions"
                            >
                              <FaKey />
                              <span className="d-none d-lg-inline">Permissions</span>
                            </button>

                            <button
                              onClick={() => handleOpenEdit(role)}
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                              title="Edit Role"
                            >
                              <FaEdit />
                            </button>
                          </>
                        )}

                        {canDelete('roles') && !role.isSystem && (
                          <button
                            onClick={() => handleDelete(role)}
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                            title="Delete Role"
                            disabled={(role._count?.users || 0) > 0}
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
        )}
      </div>

      {/* Modals */}
      <RoleFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSaved={fetchRoles}
        roleToEdit={selectedRoleForEdit}
      />

      <RolePermissionMatrixModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        role={selectedRoleForPerms}
      />
    </div>
  );
};

export default RolesPage;
