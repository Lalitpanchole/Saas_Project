/**
 * Auth Controller
 * 
 * Handles HTTP request processing, cookie setting, and responses for authentication endpoints.
 * References:
 *   - API_CONTRACT.md §6 (Auth endpoints specifications)
 *   - BUSINESS_RULES.md BR-AUTH-001 through BR-AUTH-036
 */

const authService = require('../services/authService');
const recaptchaService = require('../services/recaptchaService');
const googleAuthService = require('../services/googleAuthService');
const { sendSuccess } = require('../utils/response');
const env = require('../config/env');

/**
 * Set HTTP-only refresh token cookie.
 */
function setRefreshTokenCookie(res, tokenPlain) {
  const maxAgeMs = env.JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  res.cookie('refreshToken', tokenPlain, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: maxAgeMs,
  });
}

/**
 * Clear HTTP-only refresh token cookie.
 */
function clearRefreshTokenCookie(res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
  });
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password, rememberMe, recaptchaToken } = req.body;

    // Verify reCAPTCHA if secret key is enabled
    const recapResult = await recaptchaService.verifyRecaptcha(recaptchaToken);
    if (!recapResult.success) {
      const error = new Error(recapResult.message);
      error.statusCode = 400;
      throw error;
    }

    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const { accessToken, refreshTokenPlain, user, role, permissions, menus } = await authService.login(
      email,
      password,
      Boolean(rememberMe),
      meta
    );

    setRefreshTokenCookie(res, refreshTokenPlain);

    return sendSuccess(
      res,
      {
        accessToken,
        user,
        role,
        permissions,
        menus,
      },
      'Login successful',
      200
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const refreshTokenPlain = req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken, newRefreshTokenPlain } = await authService.refresh(refreshTokenPlain);

    setRefreshTokenCookie(res, newRefreshTokenPlain);

    return sendSuccess(
      res,
      { accessToken },
      'Token refreshed successfully',
      200
    );
  } catch (err) {
    clearRefreshTokenCookie(res);
    next(err);
  }
}

/**
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    const refreshTokenPlain = req.cookies?.refreshToken || req.body?.refreshToken;
    const meta = {
      userId: req.user?.userId || null,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    await authService.logout(refreshTokenPlain, meta);

    clearRefreshTokenCookie(res);

    return sendSuccess(res, {}, 'Logged out successfully', 200);
  } catch (err) {
    clearRefreshTokenCookie(res);
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res, next) {
  try {
    const data = await authService.getMe(req.user.userId, req.user.roleSlug);
    return sendSuccess(res, data, 'Session context restored successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/my-permissions
 */
async function getMyPermissions(req, res, next) {
  try {
    const data = await authService.getMyPermissions(req.user.userId);
    return sendSuccess(res, data, 'User permissions retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/my-menus
 */
async function getMyMenus(req, res, next) {
  try {
    const data = await authService.getMyMenus(req.user.userId);
    return sendSuccess(res, data, 'User menus retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const requestIp = req.ip || req.connection.remoteAddress;

    await authService.forgotPassword(email, requestIp);

    // Always return generic success message (BR-AUTH-011 / BR-AUTH-013)
    return sendSuccess(
      res,
      {},
      'If your email address exists in our system, you will receive password reset instructions shortly.',
      200
    );
  } catch (err) {
    // If mail sending fails or any other error, do not leak user status (BR-AUTH-022)
    console.error('Forgot password error:', err);
    return sendSuccess(
      res,
      {},
      'If your email address exists in our system, you will receive password reset instructions shortly.',
      200
    );
  }
}

/**
 * POST /api/auth/validate-reset-token
 */
async function validateResetToken(req, res, next) {
  try {
    const token = req.body.token || req.query.token;
    const data = await authService.validateResetToken(token);
    return sendSuccess(res, data, 'Reset token validation checked', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 */
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    await authService.resetPassword(token, password, meta);

    clearRefreshTokenCookie(res);

    return sendSuccess(
      res,
      {},
      'Password has been reset successfully. Please log in with your new password.',
      200
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/google
 */
async function googleLogin(req, res, next) {
  try {
    const { credential, googleToken } = req.body;
    const tokenToVerify = credential || googleToken;

    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const { accessToken, refreshTokenPlain, user, role, permissions, menus } =
      await googleAuthService.verifyGoogleTokenAndLogin(tokenToVerify, meta);

    setRefreshTokenCookie(res, refreshTokenPlain);

    return sendSuccess(
      res,
      {
        accessToken,
        user,
        role,
        permissions,
        menus,
      },
      'Google sign-in successful',
      200
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  googleLogin,
  refresh,
  logout,
  getMe,
  getMyPermissions,
  getMyMenus,
  forgotPassword,
  validateResetToken,
  resetPassword,
};
