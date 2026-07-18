/**
 * User Form Modal
 * 
 * Create and edit user details modal.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaUserPlus, FaEdit, FaTimes, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

export const UserFormModal = ({ isOpen, onClose, onSaved, userToEdit, roles = [] }) => {
  const isEditing = Boolean(userToEdit);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: '',
    password: '',
    isActive: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        firstName: userToEdit.firstName || '',
        lastName: userToEdit.lastName || '',
        email: userToEdit.email || '',
        phone: userToEdit.phone || '',
        roleId: userToEdit.role?.id || '',
        password: '', // blank unless changing
        isActive: userToEdit.isActive !== undefined ? userToEdit.isActive : true,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        roleId: roles.length > 0 ? roles[0].id : '',
        password: '',
        isActive: true,
      });
    }
  }, [userToEdit, roles, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing) {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          roleId: Number(formData.roleId),
          isActive: formData.isActive,
        };
        await apiClient.put(`/users/${userToEdit.id}`, payload);
        toast.success(`User "${formData.firstName}" updated successfully.`);
      } else {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          roleId: Number(formData.roleId),
          password: formData.password || 'Welcome@123',
          isActive: formData.isActive,
        };
        await apiClient.post('/users', payload);
        toast.success(`User "${formData.firstName}" created successfully.`);
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save user.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-responsive">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 bg-primary bg-opacity-10 rounded text-primary fs-5">
                {isEditing ? <FaEdit /> : <FaUserPlus />}
              </span>
              <h5 className="modal-title fw-bold text-dark mb-0">
                {isEditing ? 'Edit User Details' : 'Create New User'}
              </h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} disabled={submitting} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isEditing}
                  />
                  {isEditing && <small className="text-muted" style={{ fontSize: '0.75rem' }}>Email cannot be changed after creation.</small>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Assigned Role *</label>
                  <select
                    name="roleId"
                    className="form-select"
                    value={formData.roleId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.slug})
                      </option>
                    ))}
                  </select>
                </div>

                {!isEditing && (
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">Initial Password *</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control border-end-0"
                        placeholder="Welcome@123 (Default if blank)"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn bg-light border border-start-0 text-secondary px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>If left blank, sets to "Welcome@123".</small>
                  </div>
                )}

                <div className="col-12 mt-4">
                  <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                    <div>
                      <label className="form-check-label fw-semibold text-dark mb-1" htmlFor="isActiveSwitch">
                        Active Account Status
                      </label>
                      <p className="text-muted small mb-0">Inactive users are immediately blocked from logging in or using existing sessions.</p>
                    </div>
                    <input
                      className="form-check-input ms-0 fs-5"
                      type="checkbox"
                      role="switch"
                      id="isActiveSwitch"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                  </div>
                </div>
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
                    <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
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

export default UserFormModal;
