/**
 * Menus Management Page
 * 
 * Hierarchy inspector and configuration interface for system navigation items (`Menus`).
 * Supports quick visibility toggles and ordering index updates.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { usePermissions } from '../../hooks/usePermissions';
import MenuFormModal from './MenuFormModal';
import {
  FaList,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from 'react-icons/fa';

export const MenusPage = () => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [menusFlat, setMenusFlat] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedMenuForEdit, setSelectedMenuForEdit] = useState(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/menus?flat=true&includeInactive=true');
      if (res.data?.success) {
        setMenusFlat(res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load menu directory.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleOpenCreate = () => {
    setSelectedMenuForEdit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (menu) => {
    setSelectedMenuForEdit(menu);
    setFormModalOpen(true);
  };

  const handleToggleVisibility = async (menu) => {
    try {
      const payload = {
        name: menu.name,
        route: menu.route,
        isVisible: !menu.isVisible,
      };
      await apiClient.put(`/menus/${menu.id}`, payload);
      toast.success(`Visibility updated for "${menu.name}".`);
      fetchMenus();
    } catch (err) {
      toast.error('Failed to update visibility.');
    }
  };

  const handleDelete = async (menu) => {
    if (!window.confirm(`Are you sure you want to delete navigation item "${menu.name}"? This will also remove associated permissions and child items.`)) {
      return;
    }
    try {
      await apiClient.delete(`/menus/${menu.id}`);
      toast.success('Menu deleted successfully.');
      fetchMenus();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete menu item.';
      toast.error(msg);
    }
  };

  // Build tree sorting for clean display
  const topLevel = menusFlat.filter((m) => !m.parentId).sort((a, b) => a.position - b.position);
  const getChildren = (parentId) => menusFlat.filter((m) => m.parentId === parentId).sort((a, b) => a.position - b.position);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Navigation & Menus (`Menus`)</h4>
          <p className="text-muted small mb-0">Configure dashboard sidebar links, hierarchy routes, and active visibility flags.</p>
        </div>

        {canCreate('menus') && (
          <button onClick={handleOpenCreate} className="btn btn-primary-custom d-flex align-items-center justify-content-center gap-2 align-self-md-start btn-mobile-full">
            <FaPlus />
            <span>Add Navigation Item</span>
          </button>
        )}
      </div>

      <div className="premium-card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="text-muted small mt-2">Loading navigation structure...</p>
          </div>
        ) : menusFlat.length === 0 ? (
          <div className="text-center py-5">
            <h6 className="fw-bold text-dark">No navigation items found</h6>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Menu Name & Hierarchy</th>
                  <th className="py-3">Slug Identifier</th>
                  <th className="py-3">Route Path</th>
                  <th className="py-3">Order Pos</th>
                  <th className="py-3">Sidebar Visibility</th>
                  <th className="py-3">Status</th>
                  <th className="text-end px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topLevel.map((menu) => (
                  <React.Fragment key={menu.id}>
                    {/* Top Level Row */}
                    <tr>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaLayerGroup className="text-primary fs-5" />
                          <span className="fw-bold text-dark">{menu.name}</span>
                        </div>
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded text-dark border font-monospace">
                          {menu.slug}
                        </code>
                      </td>
                      <td>
                        <code className="text-primary font-monospace">{menu.route}</code>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">{menu.position}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => canUpdate('menus') && handleToggleVisibility(menu)}
                          className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                            menu.isVisible ? 'btn-success-subtle text-success' : 'btn-secondary-subtle text-secondary'
                          }`}
                          disabled={!canUpdate('menus')}
                          title={menu.isVisible ? 'Click to hide in sidebar' : 'Click to show in sidebar'}
                        >
                          {menu.isVisible ? <FaEye /> : <FaEyeSlash />}
                          <span className="small fw-semibold">{menu.isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </td>
                      <td>
                        {menu.isActive ? (
                          <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1">
                            <FaCheckCircle className="me-1" /> Active
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 px-2 py-1">
                            <FaTimesCircle className="me-1" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-end px-4">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          {canUpdate('menus') && (
                            <button
                              onClick={() => handleOpenEdit(menu)}
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                              title="Edit Menu"
                            >
                              <FaEdit />
                            </button>
                          )}
                          {canDelete('menus') && (
                            <button
                              onClick={() => handleDelete(menu)}
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                              title="Delete Menu"
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Child Rows */}
                    {getChildren(menu.id).map((child) => (
                      <tr key={child.id} className="bg-light bg-opacity-50">
                        <td className="px-4 py-2 ps-5">
                          <div className="d-flex align-items-center gap-2 ps-3 border-start border-2 border-primary border-opacity-25">
                            <FaList className="text-secondary small" />
                            <span className="fw-medium text-dark">{child.name}</span>
                          </div>
                        </td>
                        <td>
                          <code className="bg-white px-2 py-1 rounded text-secondary border font-monospace small">
                            {child.slug}
                          </code>
                        </td>
                        <td>
                          <code className="text-secondary font-monospace small">{child.route}</code>
                        </td>
                        <td>
                          <span className="badge bg-white text-secondary border small">{child.position}</span>
                        </td>
                        <td>
                          <button
                            onClick={() => canUpdate('menus') && handleToggleVisibility(child)}
                            className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                              child.isVisible ? 'btn-success-subtle text-success' : 'btn-secondary-subtle text-secondary'
                            }`}
                            disabled={!canUpdate('menus')}
                          >
                            {child.isVisible ? <FaEye /> : <FaEyeSlash />}
                            <span className="small">{child.isVisible ? 'Visible' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td>
                          {child.isActive ? (
                            <span className="badge bg-success-subtle text-success border border-success border-opacity-25 px-2 py-1 small">
                              Active
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 px-2 py-1 small">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="text-end px-4">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            {canUpdate('menus') && (
                              <button
                                onClick={() => handleOpenEdit(child)}
                                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                                title="Edit Child Menu"
                              >
                                <FaEdit />
                              </button>
                            )}
                            {canDelete('menus') && (
                              <button
                                onClick={() => handleDelete(child)}
                                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                                title="Delete Child Menu"
                              >
                                <FaTrashAlt />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MenuFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSaved={fetchMenus}
        menuToEdit={selectedMenuForEdit}
        flatMenus={menusFlat}
      />
    </div>
  );
};

export default MenusPage;
