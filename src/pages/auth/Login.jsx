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
      <h4 className="fw-bold mb-1 text-dark">Sign In to Account</h4>
      <p className="text-muted small mb-4">Please enter your login details to access the dashboard.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
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

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
            <Link to="/forgot-password" className="small text-decoration-none text-primary fw-medium">
              Forgot Password?
            </Link>
          </div>
          <div className="input-group mt-1">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <FaLock />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control border-start-0 border-end-0 ps-0"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
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
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={submitting}
          />
          <label className="form-check-label small text-muted" htmlFor="rememberMe">
            Remember me on this device
          </label>
        </div>

        {/* Google reCAPTCHA Check Box */}
        {RECAPTCHA_SITE_KEY ? (
          <div id="recaptcha-widget-container" className="mb-4 d-flex justify-content-center"></div>
        ) : (
          <div
            className={`p-3 rounded-3 mb-4 border d-flex align-items-center justify-content-between shadow-sm ${
              recaptchaChecked ? 'bg-light border-success border-opacity-50' : 'bg-light border-secondary border-opacity-25'
            }`}
            style={{ cursor: 'pointer' }}
            onClick={() => !submitting && setRecaptchaChecked(!recaptchaChecked)}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className={`rounded-1 d-flex align-items-center justify-content-center border ${
                  recaptchaChecked ? 'bg-success text-white border-success' : 'bg-white text-transparent border-secondary'
                }`}
                style={{ width: 24, height: 24 }}
              >
                <FaCheckCircle className={recaptchaChecked ? 'text-white' : 'd-none'} style={{ fontSize: 14 }} />
              </div>
              <div>
                <div className="fw-semibold small text-dark mb-0">I'm not a robot</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                  Security Verification (Local Dev Mode)
                </div>
              </div>
            </div>
            <div className="text-end">
              <FaRobot className="text-secondary fs-4 opacity-75" />
              <div className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: 0.5 }}>
                reCAPTCHA
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary-custom w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-3"
          disabled={submitting}
        >
          {submitting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <>
              <FaSignInAlt />
              <span>Sign In</span>
            </>
          )}
        </button>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 border-secondary border-opacity-25" />
          <span className="px-3 small text-muted fw-medium">OR</span>
          <hr className="flex-grow-1 border-secondary border-opacity-25" />
        </div>

        {/* Official Google Sign-In button container rendered by SDK */}
        <div id="googleSignInContainer" className="d-flex justify-content-center w-100"></div>
      </form>
    </div>
  );
};

export default Login;
