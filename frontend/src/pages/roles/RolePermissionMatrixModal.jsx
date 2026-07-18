/**
 * Role Permission Matrix Modal
 * 
 * Configures default system behavior per role across all menu items.
 * References:
 *   - ARCHITECTURE.md §9 (Default role behaviors)
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaKey, FaSave, FaCheckDouble, FaRegSquare } from 'react-icons/fa';

export const RolePermissionMatrixModal = ({ isOpen, onClose, role }) => {
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && role) {
      fetchPermissions();
    }
  }, [isOpen, role]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/roles/${role.id}/permissions`);
      if (res.data?.success) {
        setPermissionsList(res.data.data || []);
      }
    } catch (err) {
      toast.error('Could not load role permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !role) return null;

  const handleCheckboxChange = (menuId, field) => {
    if (role.slug === 'super_admin') return;
    setPermissionsList((prev) =>
      prev.map((item) => (item.menuId === menuId ? { ...item, [field]: !item[field] } : item))
    );
  };

  const handleSelectAll = () => {
    if (role.slug === 'super_admin') return;
    setPermissionsList((prev) =>
      prev.map((item) => ({
        ...item,
        canView: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true,
      }))
    );
  };

  const handleDeselectAll = () => {
    if (role.slug === 'super_admin') return;
    setPermissionsList((prev) =>
      prev.map((item) => ({
        ...item,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
      }))
    );
  };

  const handleSave = async () => {
    if (role.slug === 'super_admin') {
      toast.info('Super Admin permissions are hardcoded to full access.');
      onClose();
      return;
    }

    setSaving(true);
    try {
      const permissions = permissionsList.map((item) => ({
        menuId: item.menuId,
        canView: item.canView,
        canCreate: item.canCreate,
        canUpdate: item.canUpdate,
        canDelete: item.canDelete,
      }));

      await apiClient.put(`/roles/${role.id}/permissions`, { permissions });
      toast.success(`Updated permission mappings for role "${role.name}".`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save permissions.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-responsive">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 bg-info bg-opacity-10 rounded text-info fs-5">
                <FaKey />
              </span>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">Role Permission Configuration</h5>
                <p className="text-muted small mb-0">
                  Target Role: <strong>{role.name}</strong> (`{role.slug}`) — {role.isSystem ? 'System Tier' : 'Custom Tier'}
                </p>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {role.slug === 'super_admin' && (
              <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-3 mb-4">
                <strong>Notice:</strong> Super Admin (`super_admin`) is hardcoded to full system access across all existing and future modules.
              </div>
            )}

            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="text-secondary small fw-semibold mb-0">
                Check operations (`canView`, `canCreate`, `canUpdate`, `canDelete`) allowed by default for users in this tier.
              </p>
              {role.slug !== 'super_admin' && (
                <div className="d-flex gap-2">
                  <button type="button" onClick={handleSelectAll} className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" disabled={saving || loading}>
                    <FaCheckDouble /> Select All
                  </button>
                  <button type="button" onClick={handleDeselectAll} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" disabled={saving || loading}>
                    <FaRegSquare /> Deselect All
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="text-muted small mt-2">Loading menu matrix...</p>
              </div>
            ) : (
              <div className="table-responsive border rounded-3">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Navigation / Module</th>
                      <th className="text-center py-3">View (`canView`)</th>
                      <th className="text-center py-3">Create (`canCreate`)</th>
                      <th className="text-center py-3">Update (`canUpdate`)</th>
                      <th className="text-center py-3">Delete (`canDelete`)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsList.map((item) => (
                      <tr key={item.menuId}>
                        <td className="px-4 fw-semibold text-dark">
                          {item.menuName} <span className="text-muted small font-monospace">({item.menuSlug})</span>
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={role.slug === 'super_admin' ? true : item.canView}
                            onChange={() => handleCheckboxChange(item.menuId, 'canView')}
                            disabled={role.slug === 'super_admin'}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={role.slug === 'super_admin' ? true : item.canCreate}
                            onChange={() => handleCheckboxChange(item.menuId, 'canCreate')}
                            disabled={role.slug === 'super_admin'}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={role.slug === 'super_admin' ? true : item.canUpdate}
                            onChange={() => handleCheckboxChange(item.menuId, 'canUpdate')}
                            disabled={role.slug === 'super_admin'}
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            className="form-check-input fs-5"
                            checked={role.slug === 'super_admin' ? true : item.canDelete}
                            onChange={() => handleCheckboxChange(item.menuId, 'canDelete')}
                            disabled={role.slug === 'super_admin'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light border-top px-4 py-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary-custom px-4 d-flex align-items-center gap-2"
              disabled={saving || loading || role.slug === 'super_admin'}
            >
              {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
              <span>Save Permissions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionMatrixModal;
