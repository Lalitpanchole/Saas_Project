/**
 * Auth Service
 * 
 * Core business logic for authentication operations.
 * Implements all rules from BUSINESS_RULES.md §1 and flows from ARCHITECTURE.md §7/§20.
 * 
 * References:
 *   - API_CONTRACT.md §6 (Auth endpoints 6.1–6.9)
 *   - BUSINESS_RULES.md BR-AUTH-001 through BR-AUTH-050
 *   - ARCHITECTURE.md §7 (Authentication architecture)
 *   - ARCHITECTURE.md §20 (Forgot password architecture)
 */

const crypto = require('crypto');
const authRepo = require('../repositories/authRepository');
const { generateAccessToken, generateRefreshToken, hashToken, verifyAccessToken } = require('../utils/jwt');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');
const { logActivity } = require('./activityLogService');
const mailService = require('./mailService');
const env = require('../config/env');
const prisma = require('../config/database');

/**
 * Sanitize user object — strip sensitive fields (BR-USER-006).
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
  };
}

/**
 * Sanitize role object.
 */
function sanitizeRole(role) {
  return {
    id: role.id,
    name: role.name,
    slug: role.slug,
  };
}

// ─── Login ──────────────────────────────────────────────────────────────────

/**
 * Authenticate user and issue tokens.
 * 
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe
 * @param {{ ip: string, userAgent: string }} meta
 * @returns {{ accessToken, refreshTokenPlain, user, role, permissions, menus }}
 */
async function login(email, password, rememberMe = false, meta = {}) {
  // Find user by email
  const user = await authRepo.findUserByEmail(email);

  // Generic error for both missing user and wrong password (BR-AUTH-004)
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Check active status (BR-AUTH-001)
  if (!user.isActive) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Generate access token (BR-AUTH-005: 15 min expiry)
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roleSlug: user.role.slug,
  });

  // Generate and store refresh token
  const refreshTokenPlain = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshTokenPlain);
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

  await authRepo.createRefreshToken(user.id, refreshTokenHash, refreshExpiresAt);

  // Get permissions and menus
  const permissions = await authRepo.getUserEffectivePermissions(user.id, user.roleId);
  const menus = await authRepo.getUserMenuTree(user.id, user.roleId, user.role.slug);

  // Log activity
  logActivity({
    userId: user.id,
    action: 'LOGIN',
    module: 'auth',
    description: `User ${user.email} logged in.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return {
    accessToken,
    refreshTokenPlain,
    user: sanitizeUser(user),
    role: sanitizeRole(user.role),
    permissions,
    menus,
  };
}

// ─── Refresh ────────────────────────────────────────────────────────────────

/**
 * Rotate refresh token and issue a new access token.
 * 
 * @param {string} refreshTokenPlain
 * @returns {{ accessToken, newRefreshTokenPlain }}
 */
async function refresh(refreshTokenPlain) {
  if (!refreshTokenPlain) {
    const error = new Error('Session expired.');
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashToken(refreshTokenPlain);
  const storedToken = await authRepo.findRefreshToken(tokenHash);

  // Validate token exists, is not revoked, and is not expired
  if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
    const error = new Error('Session expired.');
    error.statusCode = 401;
    throw error;
  }

  const user = storedToken.user;

  // Check user is still active (BR-AUTH-001)
  if (!user || !user.isActive) {
    const error = new Error('Session expired.');
    error.statusCode = 401;
    throw error;
  }

  // Revoke old token (BR-AUTH-006)
  await authRepo.revokeRefreshToken(storedToken.id);

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roleSlug: user.role.slug,
  });

  // Generate and store new refresh token (rotation)
  const newRefreshTokenPlain = generateRefreshToken();
  const newRefreshTokenHash = hashToken(newRefreshTokenPlain);
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

  await authRepo.createRefreshToken(user.id, newRefreshTokenHash, newExpiresAt);

  return { accessToken, newRefreshTokenPlain };
}

// ─── Logout ─────────────────────────────────────────────────────────────────

/**
 * Revoke the refresh token on logout (BR-AUTH-007).
 * 
 * @param {string} refreshTokenPlain
 * @param {{ userId: number, ip: string, userAgent: string }} meta
 */
async function logout(refreshTokenPlain, meta = {}) {
  if (refreshTokenPlain) {
    const tokenHash = hashToken(refreshTokenPlain);
    const storedToken = await authRepo.findRefreshToken(tokenHash);
    if (storedToken && !storedToken.isRevoked) {
      await authRepo.revokeRefreshToken(storedToken.id);
    }
  }

  if (meta.userId) {
    logActivity({
      userId: meta.userId,
      action: 'LOGOUT',
      module: 'auth',
      description: 'User logged out.',
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });
  }
}

// ─── Get Me (Session Restore) ──────────────────────────────────────────────

/**
 * Get current user session context (BR-AUTH-008).
 * Returns user, role, permissions, and menus.
 * 
 * @param {number} userId
 * @param {string} roleSlug
 */
async function getMe(userId, roleSlug) {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const permissions = await authRepo.getUserEffectivePermissions(user.id, user.roleId);
  const menus = await authRepo.getUserMenuTree(user.id, user.roleId, user.role.slug);

  return {
    user: sanitizeUser(user),
    role: sanitizeRole(user.role),
    permissions,
    menus,
  };
}

/**
 * Get effective permissions for authenticated user.
 */
async function getMyPermissions(userId) {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  if (user.role.slug === 'super_admin') {
    // Super Admin gets all permissions as true
    const menus = await prisma.menu.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return menus.map((m) => ({
      menuSlug: m.slug,
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    }));
  }

  return authRepo.getUserEffectivePermissions(userId, user.roleId);
}

/**
 * Get dynamic menu tree for authenticated user.
 */
async function getMyMenus(userId) {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return authRepo.getUserMenuTree(userId, user.roleId, user.role.slug);
}

// ─── Forgot Password ───────────────────────────────────────────────────────

/**
 * Handle forgot password request.
 * Always returns success to prevent email enumeration (BR-AUTH-011/013).
 * 
 * @param {string} email
 * @param {string} requestIp
 */
async function forgotPassword(email, requestIp) {
  // Find user — bail silently if not found or inactive (BR-AUTH-012)
  const user = await authRepo.findUserByEmail(email);

  if (!user || !user.isActive) {
    // Return without doing anything — generic response sent by controller
    return;
  }

  // Invalidate previous tokens (BR-AUTH-021)
  await authRepo.invalidatePreviousResetTokens(user.id);

  // Generate crypto-secure token (BR-AUTH-015)
  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(plainToken);

  // Token expiry (BR-AUTH-018/019: default 15 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES);

  // Store hashed token (BR-AUTH-016)
  await authRepo.createPasswordResetToken(user.id, tokenHash, expiresAt, requestIp);

  // Build reset URL and send email
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${plainToken}`;

  await mailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);
}

// ─── Validate Reset Token ──────────────────────────────────────────────────

/**
 * Validate a password reset token.
 * 
 * @param {string} plainToken
 * @returns {{ valid: boolean }}
 */
async function validateResetToken(plainToken) {
  const tokenHash = hashToken(plainToken);
  const resetToken = await authRepo.findPasswordResetToken(tokenHash);

  if (!resetToken) {
    return { valid: false };
  }

  // Check not used (BR-AUTH-020)
  if (resetToken.usedAt) {
    return { valid: false };
  }

  // Check not expired (BR-AUTH-018)
  if (resetToken.expiresAt < new Date()) {
    return { valid: false };
  }

  // Check user is still active (BR-AUTH-034)
  if (!resetToken.user || !resetToken.user.isActive) {
    return { valid: false };
  }

  return { valid: true };
}

// ─── Reset Password ────────────────────────────────────────────────────────

/**
 * Reset user password using a valid reset token.
 * Executes within a transaction (BR-AUTH-031).
 * 
 * @param {string} plainToken
 * @param {string} newPassword
 * @param {{ ip: string, userAgent: string }} meta
 */
async function resetPassword(plainToken, newPassword, meta = {}) {
  const tokenHash = hashToken(plainToken);
  const resetToken = await authRepo.findPasswordResetToken(tokenHash);

  // Validate token (BR-AUTH-024)
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    const error = new Error('This password reset link is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }

  // Check user is active (BR-AUTH-034)
  if (!resetToken.user || !resetToken.user.isActive) {
    const error = new Error('This password reset link is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }

  // Validate password strength (BR-AUTH-026)
  const strength = validatePasswordStrength(newPassword);
  if (!strength.valid) {
    const error = new Error(strength.message);
    error.statusCode = 422;
    throw error;
  }

  // Hash new password (BR-AUTH-027)
  const newPasswordHash = await hashPassword(newPassword);

  // Execute in transaction (BR-AUTH-031)
  await prisma.$transaction(async (tx) => {
    // Update password
    await tx.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: newPasswordHash },
    });

    // Mark token as used (BR-AUTH-029)
    await tx.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    // Revoke all refresh tokens (BR-AUTH-030)
    await tx.refreshToken.updateMany({
      where: { userId: resetToken.userId, isRevoked: false },
      data: { isRevoked: true },
    });
  });

  // Log activity (without any password/token details — BR-AUTH-036)
  logActivity({
    userId: resetToken.userId,
    action: 'PASSWORD_RESET',
    module: 'auth',
    description: 'Password was reset via email recovery link.',
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

module.exports = {
  login,
  refresh,
  logout,
  getMe,
  getMyPermissions,
  getMyMenus,
  forgotPassword,
  validateResetToken,
  resetPassword,
  sanitizeUser,
  sanitizeRole,
};
