/**
 * Role Form Modal
 * 
 * Create and edit role details modal.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaUserShield, FaEdit, FaSave } from 'react-icons/fa';

export const RoleFormModal = ({ isOpen, onClose, onSaved, roleToEdit }) => {
  const isEditing = Boolean(roleToEdit);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roleToEdit) {
      setFormData({
        name: roleToEdit.name || '',
        slug: roleToEdit.slug || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
      });
    }
  }, [roleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    // Auto-generate slug from name only when creating
    if (!isEditing) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      setFormData({ name: val, slug: autoSlug });
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        const payload = {
          name: formData.name,
        };
        if (!roleToEdit.isSystem) {
          payload.slug = formData.slug;
        }
        await apiClient.put(`/roles/${roleToEdit.id}`, payload);
        toast.success(`Role "${formData.name}" updated successfully.`);
      } else {
        await apiClient.post('/roles', formData);
        toast.success(`Role "${formData.name}" created successfully.`);
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save role.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-responsive">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 bg-warning bg-opacity-10 rounded text-warning fs-5">
                {isEditing ? <FaEdit /> : <FaUserShield />}
              </span>
              <h5 className="modal-title fw-bold text-dark mb-0">
                {isEditing ? 'Edit Role Tier' : 'Create Custom Role Tier'}
              </h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={submitting} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Role Display Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Content Manager"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Unique Slug Identifier *</label>
                <input
                  type="text"
                  name="slug"
                  className="form-control font-monospace"
                  placeholder="e.g. content_manager"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  disabled={isEditing && roleToEdit.isSystem}
                />
                {isEditing && roleToEdit.isSystem ? (
                  <small className="text-danger small">System role slugs cannot be modified.</small>
                ) : (
                  <small className="text-muted small">Must consist only of lowercase letters, numbers, and underscores.</small>
                )}
              </div>
            </div>

            <div className="modal-footer bg-light border-top px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-custom px-4 d-flex align-items-center gap-2" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  <>
                    <FaSave />
                    <span>{isEditing ? 'Save Changes' : 'Create Role'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;
