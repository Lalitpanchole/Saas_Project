/**
 * Profile Operations Page
 * 
 * Self-service administrative profile management: personal info edits, avatar upload,
 * and high-security password rotation triggering session invalidation.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaLock,
  FaCamera,
  FaSave,
  FaEnvelope,
  FaPhone,
  FaUserShield,
} from 'react-icons/fa';

export const ProfilePage = () => {
  const { user, role, updateUserInfo, logout } = useAuth();

  // Profile Edit state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPass, setChangingPass] = useState(false);

  // Avatar upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await apiClient.put('/profile/me', profileForm);
      if (res.data?.success && res.data.data) {
        updateUserInfo(res.data.data);
        toast.success('Your profile details have been updated.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await apiClient.post('/profile/change-password', passwordForm);
      toast.success(res.data?.message || 'Password successfully updated!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Because changing password revokes all refresh tokens, prompt logout/re-login
      setTimeout(async () => {
        await logout();
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      toast.error(msg);
    } finally {
      setChangingPass(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size cannot exceed 5 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingImage(true);
    try {
      const res = await apiClient.post('/profile/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data.data) {
        updateUserInfo({ profileImageUrl: res.data.data.profileImageUrl });
        toast.success('Avatar updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to upload profile picture.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Personal Profile (`Profile`)</h4>
          <p className="text-muted small mb-0">Manage your account information, profile avatar, and account security.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Avatar & Summary */}
        <div className="col-12 col-lg-4">
          <div className="premium-card text-center p-4">
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mx-auto shadow-sm overflow-hidden"
                style={{ width: 'clamp(80px, 30vw, 120px)', height: 'clamp(80px, 30vw, 120px)', fontSize: '3rem', fontWeight: 'bold' }}
              >
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="avatar" className="w-100 h-100 object-fit-cover" />
                ) : (
                  user?.firstName ? user.firstName[0].toUpperCase() : 'U'
                )}
              </div>
              <label
                htmlFor="avatarUploadInput"
                className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 shadow d-flex align-items-center justify-content-center p-2"
                style={{ cursor: 'pointer', width: 36, height: 36 }}
                title="Upload Profile Picture"
              >
                {uploadingImage ? <span className="spinner-border spinner-border-sm" /> : <FaCamera />}
              </label>
              <input
                type="file"
                id="avatarUploadInput"
                className="d-none"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </div>

            <h5 className="fw-bold text-dark mb-1">
              {user?.firstName} {user?.lastName || ''}
            </h5>
            <p className="text-muted small mb-3">{user?.email}</p>

            <div className="d-flex justify-content-center mb-3">
              <span className={`badge-role badge-${role?.slug || 'default'} px-3 py-1`}>
                <FaUserShield className="me-1" /> {role?.name || role?.slug}
              </span>
            </div>

            <div className="border-top pt-3 text-start small">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted d-flex align-items-center gap-2">
                  <FaEnvelope className="small" /> Email Status
                </span>
                <span className="fw-semibold text-success">Verified</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted d-flex align-items-center gap-2">
                  <FaPhone className="small" /> Phone Number
                </span>
                <span className="fw-semibold text-dark">{user?.phone || 'Not Provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="col-12 col-lg-8">
          {/* Profile Details Card */}
          <div className="premium-card mb-4">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <FaUser className="text-primary" />
              <span>Personal Details</span>
            </h5>

            <form onSubmit={handleProfileSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    required
                    disabled={savingProfile}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    disabled={savingProfile}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Email Address (Read Only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email || ''}
                    disabled
                  />
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Email changes require admin assistance.</small>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    disabled={savingProfile}
                  />
                </div>

                <div className="col-12 mt-4 d-grid d-md-block">
                  <button type="submit" className="btn btn-primary-custom px-4 d-inline-flex align-items-center justify-content-center gap-2" disabled={savingProfile}>
                    {savingProfile ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="premium-card border-danger border-opacity-25">
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <FaLock className="text-danger" />
              <span>Change Account Password</span>
            </h5>
            <p className="text-muted small mb-4">
              Rotating your password will instantly revoke all active refresh tokens and sign out any other logged-in devices.
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control"
                    placeholder="Enter current password..."
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="Min 8 chars, 1 uppercase, 1 symbol..."
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Verify new password..."
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={changingPass}
                  />
                </div>

                <div className="col-12 mt-4 d-grid d-md-block">
                  <button type="submit" className="btn btn-outline-danger px-4 d-inline-flex align-items-center justify-content-center gap-2" disabled={changingPass}>
                    {changingPass ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaLock />}
                    <span>Update Password & Revoke Sessions</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
