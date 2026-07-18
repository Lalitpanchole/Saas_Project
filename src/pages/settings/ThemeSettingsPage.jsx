/**
 * Theme & Branding Settings Page
 * 
 * Administrative control over application branding (`appName`), primary/secondary theme colors,
 * and custom logos. Instantly updates live CSS tokens upon saving.
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { FaPalette, FaSave, FaImage, FaLaptopCode } from 'react-icons/fa';

export const ThemeSettingsPage = () => {
  const { canUpdate } = usePermissions();
  const { theme, setTheme, fetchTheme } = useTheme();
  const [formData, setFormData] = useState({
    appName: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#0d6efd',
    secondaryColor: '#6c757d',
    sidebarColor: '#0f172a',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    textColor: '#212529',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (theme) {
      setFormData({
        appName: theme.appName || '',
        logoUrl: theme.logoUrl || '',
        faviconUrl: theme.faviconUrl || '',
        primaryColor: theme.primaryColor || '#0d6efd',
        secondaryColor: theme.secondaryColor || '#6c757d',
        sidebarColor: theme.sidebarColor || '#0f172a',
        fontFamily: theme.fontFamily || 'Inter, system-ui, sans-serif',
        fontSize: theme.fontSize || '14px',
        textColor: theme.textColor || '#212529',
      });
    }
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiClient.put('/settings/theme', formData);
      if (res.data?.success && res.data.data) {
        setTheme(res.data.data);
        toast.success('Application branding and theme settings updated successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update theme settings.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Theme & Branding Configuration (`Settings`)</h4>
          <p className="text-muted small mb-0">Customize system-wide branding tokens, logo assets, and CSS variable palettes.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="premium-card">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <FaPalette className="text-primary" />
              <span>Branding Parameters</span>
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Application Name *</label>
                <input
                  type="text"
                  name="appName"
                  className="form-control"
                  placeholder="e.g. Acme Admin Portal"
                  value={formData.appName}
                  onChange={handleChange}
                  required
                  disabled={!canUpdate('settings') || saving}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Primary Brand Color *</label>
                  <div className="input-group">
                    <input
                      type="color"
                      name="primaryColor"
                      className="form-control form-control-color border-end-0"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                      style={{ width: 'clamp(40px, 15vw, 50px)' }}
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      className="form-control font-monospace border-start-0 px-2 small"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Secondary Accent *</label>
                  <div className="input-group">
                    <input
                      type="color"
                      name="secondaryColor"
                      className="form-control form-control-color border-end-0"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                      style={{ width: 'clamp(40px, 15vw, 50px)' }}
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      className="form-control font-monospace border-start-0 px-2 small"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Sidebar Color *</label>
                  <div className="input-group">
                    <input
                      type="color"
                      name="sidebarColor"
                      className="form-control form-control-color border-end-0"
                      value={formData.sidebarColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                      style={{ width: 'clamp(40px, 15vw, 50px)' }}
                    />
                    <input
                      type="text"
                      name="sidebarColor"
                      className="form-control font-monospace border-start-0 px-2 small"
                      value={formData.sidebarColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Font Family *</label>
                  <select
                    name="fontFamily"
                    className="form-select small"
                    value={formData.fontFamily}
                    onChange={handleChange}
                    disabled={!canUpdate('settings') || saving}
                  >
                    <option value="Inter, system-ui, sans-serif">Inter (Modern & Clean)</option>
                    <option value="'Roboto', system-ui, sans-serif">Roboto (Google Classic)</option>
                    <option value="'Outfit', system-ui, sans-serif">Outfit (Sleek & Geometric)</option>
                    <option value="'Poppins', system-ui, sans-serif">Poppins (Friendly Rounded)</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI (System Standard)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Base Font Size *</label>
                  <select
                    name="fontSize"
                    className="form-select small"
                    value={formData.fontSize}
                    onChange={handleChange}
                    disabled={!canUpdate('settings') || saving}
                  >
                    <option value="13px">13px (Compact)</option>
                    <option value="14px">14px (Standard)</option>
                    <option value="15px">15px (Medium)</option>
                    <option value="16px">16px (Large & Readable)</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">Main Text Color *</label>
                  <div className="input-group">
                    <input
                      type="color"
                      name="textColor"
                      className="form-control form-control-color border-end-0"
                      value={formData.textColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                      style={{ width: 'clamp(40px, 15vw, 50px)' }}
                    />
                    <input
                      type="text"
                      name="textColor"
                      className="form-control font-monospace border-start-0 px-2 small"
                      value={formData.textColor}
                      onChange={handleChange}
                      disabled={!canUpdate('settings') || saving}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Logo Asset URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <FaImage />
                  </span>
                  <input
                    type="url"
                    name="logoUrl"
                    className="form-control"
                    placeholder="https://example.com/logo.png (Optional)"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    disabled={!canUpdate('settings') || saving}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">Favicon Asset URL</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <FaImage />
                  </span>
                  <input
                    type="url"
                    name="faviconUrl"
                    className="form-control"
                    placeholder="https://example.com/favicon.ico (Optional)"
                    value={formData.faviconUrl}
                    onChange={handleChange}
                    disabled={!canUpdate('settings') || saving}
                  />
                </div>
              </div>

              {canUpdate('settings') && (
                <div className="d-grid d-md-block">
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4 d-inline-flex align-items-center justify-content-center gap-2"
                    disabled={saving}
                  >
                    {saving ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> : <FaSave />}
                    <span>Save Brand Settings</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="col-12 col-lg-5">
          <div
            className="premium-card bg-light border-0"
            style={{ fontFamily: formData.fontFamily, fontSize: formData.fontSize, color: formData.textColor }}
          >
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <FaLaptopCode className="text-secondary" />
              <span>Realtime UI Preview</span>
            </h5>
            <p className="text-muted small mb-4">
              Preview how your sidebar header, buttons, badges, and typography appear with the selected tokens.
            </p>

            <div className="p-3 rounded-3 mb-3 text-white d-flex align-items-center justify-content-between shadow-sm" style={{ backgroundColor: formData.sidebarColor || '#0f172a' }}>
              <div className="d-flex align-items-center gap-2">
                {formData.logoUrl && <img src={formData.logoUrl} alt="logo" style={{ height: 28, borderRadius: 4 }} />}
                <span className="fw-bold fs-6">{formData.appName || 'RBAC Starter'}</span>
              </div>
              <span className="badge bg-white bg-opacity-25 small">Sidebar Header</span>
            </div>

            <div className="p-4 rounded-3 border bg-white shadow-sm">
              <h6 className="fw-bold mb-2 text-dark">Button & Badge Test</h6>
              <p className="text-muted small mb-3">Check color contrast and button hover elevation.</p>

              <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  className="btn text-white fw-semibold px-3 py-1 rounded"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Primary Action Button
                </button>

                <button
                  type="button"
                  className="btn text-white fw-semibold px-3 py-1 rounded"
                  style={{ backgroundColor: formData.secondaryColor }}
                >
                  Secondary Action
                </button>
              </div>

              <div className="d-flex gap-2">
                <span
                  className="badge px-3 py-1 rounded-pill"
                  style={{ backgroundColor: formData.primaryColor, color: '#fff' }}
                >
                  Primary Badge
                </span>
                <span
                  className="badge px-3 py-1 rounded-pill"
                  style={{ backgroundColor: formData.secondaryColor, color: '#fff' }}
                >
                  Secondary Badge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;
