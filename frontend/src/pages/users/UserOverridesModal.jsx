/**
 * User Overrides Modal
 * 
 * Granular user-level permission override matrix. Enables explicitly granting or revoking
 * specific menu actions (`canView`, `canCreate`, `canUpdate`, `canDelete`) independently of role defaults.
 * References:
 *   - ARCHITECTURE.md §9 (Override-first priority algorithm)
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaUserShield, FaSave, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';

export const UserOverridesModal = ({ isOpen, onClose, user }) => {
  const [permissionsList, setPermissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchOverrides();
    }
  }, [isOpen, user]);

  const fetchOverrides = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/users/${user.id}/overrides`);
      if (res.data?.success) {
        const list = (res.data.data || []).map(item => ({
          ...item,
          userOverride: item.userOverride || item.userOverrides || { canView: null, canCreate: null, canUpdate: null, canDelete: null }
        }));
        setPermissionsList(list);
      }
    } catch (err) {
      toast.error('Could not load user permission overrides.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  // Toggle explicit override: null -> true -> false -> null
  const handleToggle = (menuId, field) => {
    setPermissionsList((prev) =>
      prev.map((item) => {
        if (item.menuId !== menuId) return item;
        const currentVal = item.userOverride?.[field];
        let nextVal = null;
        if (currentVal === null || currentVal === undefined) nextVal = true;
        else if (currentVal === true) nextVal = false;
        else nextVal = null;

        return {
          ...item,
          userOverride: {
            ...item.userOverride,
            [field]: nextVal,
          },
        };
      })
    );
  };

  const handleClearAll = async () => {
    setSaving(true);
    try {
      await apiClient.put(`/users/${user.id}/overrides`, { overrides: [] });
      toast.success(`Cleared all permission overrides for ${user.firstName}.`);
      await fetchOverrides();
    } catch (err) {
      toast.error('Failed to clear overrides.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const overrides = [];
      permissionsList.forEach((item) => {
        const u = item.userOverride || {};
        if (u.canView !== null && u.canView !== undefined ||
            u.canCreate !== null && u.canCreate !== undefined ||
            u.canUpdate !== null && u.canUpdate !== undefined ||
            u.canDelete !== null && u.canDelete !== undefined) {
          overrides.push({
            menuId: item.menuId,
            canView: u.canView,
            canCreate: u.canCreate,
            canUpdate: u.canUpdate,
            canDelete: u.canDelete,
          });
        }
      });

      await apiClient.put(`/users/${user.id}/overrides`, { overrides });
      toast.success(`Updated permission overrides for ${user.firstName}.`);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save overrides.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const renderOverrideBadge = (val, roleDefault) => {
    if (val === true) {
      return <span className="badge bg-success text-white px-2 py-1"><FaCheck className="me-1" /> Explicit YES</span>;
    }
    if (val === false) {
      return <span className="badge bg-danger text-white px-2 py-1"><FaTimes className="me-1" /> Explicit NO</span>;
    }
    return (
      <span className="badge bg-light text-secondary border px-2 py-1">
        Inherit ({roleDefault ? 'YES' : 'NO'})
      </span>
    );
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-responsive">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 bg-warning bg-opacity-10 rounded text-warning fs-5">
                <FaUserShield />
              </span>
              <div>
                <h5 className="modal-title fw-bold text-dark mb-0">User Permission Overrides</h5>
                <p className="text-muted small mb-0">
                  Target: <strong>{user.firstName} {user.lastName || ''}</strong> ({user.email}) — Role: <strong>{user.role?.name}</strong>
                </p>
              </div>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving} />
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="alert alert-info border-0 shadow-sm d-flex align-items-center justify-content-between mb-4">
              <div className="small">
                <strong>How Overrides Work:</strong> Click any cell to toggle: 
                <span className="badge bg-success mx-1">Explicit YES</span> → 
                <span className="badge bg-danger mx-1">Explicit NO</span> → 
                <span className="badge bg-light text-secondary border mx-1">Inherit Role Default</span>.
                Overrides strictly take precedence over role definitions.
              </div>
              <button onClick={handleClearAll} className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 flex-shrink-0 ms-3" disabled={saving || loading}>
                <FaTrashAlt />
                <span>Reset All to Inherit</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="text-muted small mt-2">Loading menu overrides...</p>
              </div>
            ) : (
              <div className="table-responsive border rounded-3">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-3 py-3">Menu Module</th>
                      <th className="text-center py-3">View (`canView`)</th>
                      <th className="text-center py-3">Create (`canCreate`)</th>
                      <th className="text-center py-3">Update (`canUpdate`)</th>
                      <th className="text-center py-3">Delete (`canDelete`)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionsList.map((item) => {
                      const u = item.userOverride || {};
                      const r = item.roleDefault || {};
                      return (
                        <tr key={item.menuId}>
                          <td className="px-3 fw-semibold text-dark">
                            {item.menuName} <span className="text-muted small">({item.menuSlug})</span>
                          </td>
                          <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleToggle(item.menuId, 'canView')}>
                            {renderOverrideBadge(u.canView, r.canView)}
                          </td>
                          <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleToggle(item.menuId, 'canCreate')}>
                            {renderOverrideBadge(u.canCreate, r.canCreate)}
                          </td>
                          <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleToggle(item.menuId, 'canUpdate')}>
                            {renderOverrideBadge(u.canUpdate, r.canUpdate)}
                          </td>
                          <td className="text-center" style={{ cursor: 'pointer' }} onClick={() => handleToggle(item.menuId, 'canDelete')}>
                            {renderOverrideBadge(u.canDelete, r.canDelete)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light border-top px-4 py-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="btn btn-primary-custom px-4 d-flex align-items-center gap-2" disabled={saving || loading}>
              {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
              <span>Save Overrides</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverridesModal;
