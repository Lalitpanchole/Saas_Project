/**
 * Login Screen
 * 
 * Sleek, premium authentication interface supporting email/password and rememberMe.
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { GOOGLE_CLIENT_ID, RECAPTCHA_SITE_KEY } from '../../config/config';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaCheckCircle, FaRobot } from 'react-icons/fa';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaChecked, setRecaptchaChecked] = useState(Boolean(!RECAPTCHA_SITE_KEY));
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const initAndPromptGoogle = (onlyInit = false) => {
    if (!GOOGLE_CLIENT_ID) {
      if (!onlyInit) {
        toast.info('ℹ️ Google Client ID (VITE_GOOGLE_CLIENT_ID) is not set in .env yet. Add your key from Google Cloud Console to enable live OAuth login!');
      }
      return;
    }
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt: false, // Prevents FedCM NetworkError on local HTTP development
          callback: async (response) => {
            if (response.credential) {
              setSubmitting(true);
              try {
                await googleLogin(response.credential);
                toast.success('Signed in with Google successfully!');
                navigate('/');
              } catch (err) {
                const msg = err.response?.data?.message || 'Google sign-in failed.';
                toast.error(msg);
              } finally {
                setSubmitting(false);
              }
            }
          },
        });

        // Render official Google button if container exists
        const btnContainer = document.getElementById('googleSignInContainer');
        if (btnContainer && window.google.accounts.id.renderButton) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: '350',
          });
        }

        if (!onlyInit) {
          window.google.accounts.id.prompt();
        }
      } catch (e) {
        console.warn('Google Identity initialization warning:', e);
      }
    } else if (!onlyInit) {
      toast.error('Google Sign-in SDK still loading. Please try again in a second.');
    }
  };

  useEffect(() => {
    initAndPromptGoogle(true);
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        initAndPromptGoogle(true);
        clearInterval(timer);
      }
    }, 500);

    // Initialize Google reCAPTCHA v2 if site key is configured
    let rcTimer;
    if (RECAPTCHA_SITE_KEY) {
      if (!window.grecaptcha && !document.getElementById('google-recaptcha-script')) {
        const script = document.createElement('script');
        script.id = 'google-recaptcha-script';
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      const renderRecaptcha = () => {
        const container = document.getElementById('recaptcha-widget-container');
        if (window.grecaptcha?.render && container && container.innerHTML === '') {
          try {
            window.grecaptcha.render(container, {
              sitekey: RECAPTCHA_SITE_KEY,
              callback: (token) => {
                setRecaptchaToken(token);
                setRecaptchaChecked(true);
              },
              'expired-callback': () => {
                setRecaptchaToken(null);
                setRecaptchaChecked(false);
              },
            });
          } catch (err) {
            console.warn('reCAPTCHA render warning:', err);
          }
        }
      };

      rcTimer = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          renderRecaptcha();
          clearInterval(rcTimer);
        }
      }, 500);
    }

    return () => {
      clearInterval(timer);
      if (rcTimer) clearInterval(rcTimer);
    };
  }, [googleLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    if (RECAPTCHA_SITE_KEY && !recaptchaChecked) {
      toast.error('Please verify that you are not a robot (reCAPTCHA check).');
      return;
    }

    setSubmitting(true);
    try {
      const tokenToSend = RECAPTCHA_SITE_KEY ? recaptchaToken : (recaptchaChecked ? 'recaptcha_verified_token' : null);
      await login(email, password, rememberMe, tokenToSend);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-1" style={{ color: '#111827' }}>Sign In to Account</h4>
      <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Please enter your login details to access the dashboard.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium mb-1" style={{ fontSize: '0.875rem', color: '#374151' }}>Email Address</label>
          <div className="input-group">
            <span className="input-group-text bg-transparent text-muted">
              <FaEnvelope size={14} />
            </span>
            <input
              type="email"
              className="form-control border-start-0 ps-2"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fw-medium mb-0" style={{ fontSize: '0.875rem', color: '#374151' }}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>
          <div className="input-group">
            <span className="input-group-text bg-transparent text-muted">
              <FaLock size={14} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control border-start-0 border-end-0 ps-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
            <button
              type="button"
              className="input-group-text password-toggle px-3"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          </div>
        </div>

        <div className="mb-4 form-check d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input mt-0"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={submitting}
            style={{ cursor: 'pointer' }}
          />
          <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}>
            Remember me on this device
          </label>
        </div>

        {/* Google reCAPTCHA Check Box */}
        {RECAPTCHA_SITE_KEY ? (
          <div id="recaptcha-widget-container" className="mb-4 d-flex justify-content-center"></div>
        ) : (
          <div
            className="p-3 mb-4 rounded-3 border d-flex align-items-center justify-content-between"
            style={{ 
              cursor: 'pointer',
              backgroundColor: '#fafafa',
              borderColor: recaptchaChecked ? '#a7f3d0' : '#f3f4f6',
              transition: 'all 0.2s ease'
            }}
            onClick={() => !submitting && setRecaptchaChecked(!recaptchaChecked)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className={`rounded flex-shrink-0 d-flex align-items-center justify-content-center border`}
                style={{ 
                  width: 22, 
                  height: 22, 
                  backgroundColor: recaptchaChecked ? '#10b981' : '#fff',
                  borderColor: recaptchaChecked ? '#10b981' : '#d1d5db',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaCheckCircle className={recaptchaChecked ? 'text-white' : 'd-none'} style={{ fontSize: 12 }} />
              </div>
              <div>
                <div className="fw-medium text-dark mb-0" style={{ fontSize: '0.85rem' }}>I'm not a robot</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                  Security Verification (Local Dev Mode)
                </div>
              </div>
            </div>
            <div className="text-end">
              <FaRobot className="text-secondary opacity-50" size={20} />
              <div className="text-muted fw-bold mt-1" style={{ fontSize: '0.55rem', letterSpacing: 0.5 }}>
                reCAPTCHA
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2 mb-4"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <>
              <FaSignInAlt size={14} />
              <span>Sign In</span>
            </>
          )}
        </button>

        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1 m-0" style={{ borderColor: '#e5e7eb' }} />
          <span className="px-3 text-muted fw-medium" style={{ fontSize: '0.75rem' }}>OR</span>
          <hr className="flex-grow-1 m-0" style={{ borderColor: '#e5e7eb' }} />
        </div>

        {/* Official Google Sign-In button container rendered by SDK */}
        <div id="googleSignInContainer" className="d-flex justify-content-center w-100"></div>
      </form>
    </div>
  );
};

export default Login;
