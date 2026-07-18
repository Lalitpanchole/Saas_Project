/**
 * Forgot Password Screen
 * 
 * Allows users to request a password reset link sent to their email.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaEnvelope, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        setSent(true);
        toast.success('If an account exists, a reset link has been sent.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
          <FaPaperPlane className="fs-3" />
        </div>
        <h4 className="fw-bold mb-2">Check Your Email</h4>
        <p className="text-muted small mb-4">
          We have sent password reset instructions to <strong>{email}</strong> if an account exists.
        </p>
        <Link to="/login" className="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center gap-2">
          <FaArrowLeft />
          <span>Back to Sign In</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h4 className="fw-bold mb-1 text-dark">Reset Password</h4>
      <p className="text-muted small mb-4">Enter your registered email address to receive recovery instructions.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label small fw-semibold text-secondary">Email Address</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <>
              <FaPaperPlane />
              <span>Send Reset Link</span>
            </>
          )}
        </button>

        <div className="text-center">
          <Link to="/login" className="small text-decoration-none text-muted d-inline-flex align-items-center gap-1">
            <FaArrowLeft className="small" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
