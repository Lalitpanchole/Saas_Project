/**
 * Menu Form Modal
 * 
 * Create and edit menu items and structure.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaList, FaEdit, FaSave } from 'react-icons/fa';

export const MenuFormModal = ({ isOpen, onClose, onSaved, menuToEdit, flatMenus = [] }) => {
  const isEditing = Boolean(menuToEdit);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    route: '',
    icon: '',
    parentId: '',
    position: 0,
    isDropdown: false,
    isVisible: true,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (menuToEdit) {
      setFormData({
        name: menuToEdit.name || '',
        slug: menuToEdit.slug || '',
        route: menuToEdit.route || '',
        icon: menuToEdit.icon || '',
        parentId: menuToEdit.parentId !== null && menuToEdit.parentId !== undefined ? menuToEdit.parentId : '',
        position: menuToEdit.position || 0,
        isDropdown: Boolean(menuToEdit.isDropdown),
        isVisible: Boolean(menuToEdit.isVisible),
        isActive: Boolean(menuToEdit.isActive),
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        route: '/',
        icon: '',
        parentId: '',
        position: flatMenus.length * 10,
        isDropdown: false,
        isVisible: true,
        isActive: true,
      });
    }
  }, [menuToEdit, flatMenus, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!isEditing) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      const autoRoute = `/${val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
      setFormData((prev) => ({ ...prev, name: val, slug: autoSlug, route: autoRoute }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        route: formData.route,
        icon: formData.icon || null,
        parentId: formData.parentId ? Number(formData.parentId) : null,
        position: Number(formData.position),
        isDropdown: formData.isDropdown,
        isVisible: formData.isVisible,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await apiClient.put(`/menus/${menuToEdit.id}`, payload);
        toast.success(`Menu "${formData.name}" updated successfully.`);
      } else {
        await apiClient.post('/menus', payload);
        toast.success(`Menu "${formData.name}" created successfully.`);
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save menu.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out self or children if editing so we don't allow self-parenting
  const parentCandidates = flatMenus.filter((m) => !isEditing || m.id !== menuToEdit.id);

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-responsive">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 bg-info bg-opacity-10 rounded text-info fs-5">
                {isEditing ? <FaEdit /> : <FaList />}
              </span>
              <h5 className="modal-title fw-bold text-dark mb-0">
                {isEditing ? 'Edit Navigation Item' : 'Add Navigation Item'}
              </h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={submitting} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Display Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Invoices"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Unique Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    className="form-control font-monospace"
                    placeholder="e.g. invoices"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Lower letters/numbers/underscores.</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Route Path *</label>
                  <input
                    type="text"
                    name="route"
                    className="form-control font-monospace"
                    placeholder="e.g. /invoices"
                    value={formData.route}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Parent Menu (Optional)</label>
                  <select
                    name="parentId"
                    className="form-select"
                    value={formData.parentId}
                    onChange={handleChange}
                  >
                    <option value="">Top-level Item (No Parent)</option>
                    {parentCandidates.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Display Position Index</label>
                  <input
                    type="number"
                    name="position"
                    className="form-control"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Icon Name (Optional)</label>
                  <input
                    type="text"
                    name="icon"
                    className="form-control"
                    placeholder="e.g. FaChartBar"
                    value={formData.icon}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mt-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                        <div>
                          <label className="form-check-label fw-semibold text-dark mb-1" htmlFor="isVisibleSwitch">
                            Visible in Sidebar (`isVisible`)
                          </label>
                          <p className="text-muted small mb-0">Whether this item appears in navigation menus when permitted.</p>
                        </div>
                        <input
                          className="form-check-input ms-0 fs-5"
                          type="checkbox"
                          role="switch"
                          id="isVisibleSwitch"
                          name="isVisible"
                          checked={formData.isVisible}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                        <div>
                          <label className="form-check-label fw-semibold text-dark mb-1" htmlFor="isActiveMenuSwitch">
                            Active Status (`isActive`)
                          </label>
                          <p className="text-muted small mb-0">Inactive items are disabled system-wide across all roles.</p>
                        </div>
                        <input
                          className="form-check-input ms-0 fs-5"
                          type="checkbox"
                          role="switch"
                          id="isActiveMenuSwitch"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom px-4 d-flex align-items-center gap-2" disabled={submitting}>
                {submitting ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
                <span>{isEditing ? 'Save Changes' : 'Create Menu'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuFormModal;
