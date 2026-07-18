/**
 * Reset Password Screen
 * 
 * Verifies reset token from URL and sets a new password.
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaLock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill out both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });

      if (res.data?.success) {
        setSuccess(true);
        toast.success('Password successfully reset!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset token is invalid or has expired.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
          <FaCheckCircle className="fs-3" />
        </div>
        <h4 className="fw-bold mb-2">Password Reset Successful</h4>
        <p className="text-muted small mb-4">Your password has been updated. You can now log in with your new credentials.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary-custom w-100 py-2">
          Proceed to Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-1 text-dark">Set New Password</h4>
      <p className="text-muted small mb-4">Choose a strong password with letters, numbers, and symbols.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label small fw-semibold text-secondary">New Password</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <FaLock />
            </span>
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={submitting}
            />
            <button
              type="button"
              className="btn bg-light border border-start-0 text-secondary px-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
              tabIndex={-1}
              title={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold text-secondary">Confirm New Password</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <FaLock />
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={submitting}
            />
            <button
              type="button"
              className="btn bg-light border border-start-0 text-secondary px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary-custom w-100 py-2 mb-3"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <span>Update Password</span>
          )}
        </button>

        <div className="text-center">
          <Link to="/login" className="small text-decoration-none text-muted">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
