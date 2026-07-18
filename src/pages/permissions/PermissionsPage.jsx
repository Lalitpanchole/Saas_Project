/**
 * Global Permissions Matrix Page
 * 
 * Central cross-role access matrix providing batch visualization and multi-role updates
 * across all registered menu modules (`canView`, `canCreate`, `canUpdate`, `canDelete`).
 * References:
 *   - ARCHITECTURE.md §9 (Global matrix structure)
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { usePermissions } from '../../hooks/usePermissions';
import { FaKey, FaSave, FaCheckCircle, FaLock } from 'react-icons/fa';

export const PermissionsPage = () => {
  const { canUpdate } = usePermissions();
  const [matrixData, setMatrixData] = useState({ roles: [], menus: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchMatrix = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/permissions/matrix');
      if (res.data?.success) {
        setMatrixData(res.data.data || { roles: [], menus: [] });
      }
    } catch (err) {
      toast.error('Failed to load global permission matrix.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const handleCheckboxChange = (roleId, menuId, field) => {
    const roleObj = matrixData.roles.find((r) => r.roleId === roleId);
    if (roleObj && roleObj.roleSlug === 'super_admin') return;

    setMatrixData((prev) => {
      const updatedRoles = prev.roles.map((r) => {
        if (r.roleId !== roleId) return r;
        const updatedPerms = r.permissions.map((p) => {
          if (p.menuId !== menuId) return p;
          return { ...p, [field]: !p[field] };
        });
        return { ...r, permissions: updatedPerms };
      });
      return { ...prev, roles: updatedRoles };
    });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updates = [];
      matrixData.roles.forEach((r) => {
        if (r.roleSlug === 'super_admin') return;
        r.permissions.forEach((p) => {
          updates.push({
            roleId: r.roleId,
            menuId: p.menuId,
            canView: p.canView,
            canCreate: p.canCreate,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete,
          });
        });
      });

      await apiClient.put('/permissions/matrix', { updates });
      toast.success('Global permission matrix saved successfully.');
      await fetchMatrix();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save global matrix.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Global Permissions Matrix (`Permissions`)</h4>
          <p className="text-muted small mb-0">Cross-tabular overview of all access rights. Batch modify and commit access rules.</p>
        </div>

        {canUpdate('permissions') && (
          <button
            onClick={handleSaveAll}
            className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 align-self-md-start shadow-sm btn-mobile-full"
            disabled={saving || loading}
          >
            {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
            <span>Commit Global Matrix</span>
          </button>
        )}
      </div>

      <div className="premium-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Assembling global permissions matrix...</p>
          </div>
        ) : matrixData.roles.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-bold text-dark">Matrix empty</h6>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="bg-light text-center">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 align-middle bg-light text-start w-auto">
                    Navigation Module
                  </th>
                  {matrixData.roles.map((role) => (
                    <th key={role.roleId} colSpan={4} className="py-2 bg-light border-bottom-0">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <span className="fw-bold text-dark">{role.roleName}</span>
                        {role.roleSlug === 'super_admin' && <FaLock className="text-danger small ms-1" title="Hardcoded Full Access" />}
                      </div>
                      <span className="badge bg-white text-secondary border font-monospace small">
                        {role.roleSlug}
                      </span>
                    </th>
                  ))}
                </tr>
                <tr className="bg-light small text-secondary">
                  {matrixData.roles.map((role) => (
                    <React.Fragment key={role.roleId}>
                      <th className="py-1 px-2" title="View">V</th>
                      <th className="py-1 px-2" title="Create">C</th>
                      <th className="py-1 px-2" title="Update">U</th>
                      <th className="py-1 px-2" title="Delete">D</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.menus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="px-4 py-2 fw-semibold text-dark">
                      {menu.name}{' '}
                      <code className="text-muted small font-monospace d-block" style={{ fontSize: '0.75rem' }}>
                        {menu.slug}
                      </code>
                    </td>
                    {matrixData.roles.map((role) => {
                      const p = role.permissions.find((pm) => pm.menuId === menu.id) || {
                        canView: false,
                        canCreate: false,
                        canUpdate: false,
                        canDelete: false,
                      };
                      const isSuper = role.roleSlug === 'super_admin';

                      return (
                        <React.Fragment key={`${role.roleId}_${menu.id}`}>
                          <td className="text-center bg-white">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isSuper ? true : p.canView}
                              onChange={() => handleCheckboxChange(role.roleId, menu.id, 'canView')}
                              disabled={isSuper || !canUpdate('permissions')}
                            />
                          </td>
                          <td className="text-center bg-white">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isSuper ? true : p.canCreate}
                              onChange={() => handleCheckboxChange(role.roleId, menu.id, 'canCreate')}
                              disabled={isSuper || !canUpdate('permissions')}
                            />
                          </td>
                          <td className="text-center bg-white">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isSuper ? true : p.canUpdate}
                              onChange={() => handleCheckboxChange(role.roleId, menu.id, 'canUpdate')}
                              disabled={isSuper || !canUpdate('permissions')}
                            />
                          </td>
                          <td className="text-center bg-white border-end">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={isSuper ? true : p.canDelete}
                              onChange={() => handleCheckboxChange(role.roleId, menu.id, 'canDelete')}
                              disabled={isSuper || !canUpdate('permissions')}
                            />
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsPage;
