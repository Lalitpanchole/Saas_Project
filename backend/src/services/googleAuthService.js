/**
 * Google OAuth Verification & Login Service
 * 
 * Verifies Google ID token, finds or auto-registers user, returns session tokens and permissions.
 */
const env = require('../config/env');
const authService = require('./authService');
const authRepo = require('../repositories/authRepository');
const userRepo = require('../repositories/userRepository');
const roleRepo = require('../repositories/roleRepository');
const { generateAccessToken, generateRefreshToken, hashToken } = require('../utils/jwt');
const { hashPassword } = require('../utils/password');
const { logActivity } = require('./activityLogService');

async function verifyGoogleTokenAndLogin(credential, meta = {}) {
  if (!credential) {
    const error = new Error('Google credential token is required.');
    error.statusCode = 400;
    throw error;
  }

  // Verify ID token with Google
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!res.ok) {
    const error = new Error('Invalid or expired Google token.');
    error.statusCode = 401;
    throw error;
  }

  const payload = await res.json();
  const { email, given_name, family_name, picture } = payload;

  if (!email) {
    const error = new Error('No email address provided by Google account.');
    error.statusCode = 400;
    throw error;
  }

  // Check if user exists
  let user = await authRepo.findUserByEmail(email);

  if (!user) {
    // Auto-create user with default role ('user' or lowest privilege)
    const allRoles = await roleRepo.findRoles();
    let defaultRole = allRoles.find((r) => r.slug === 'user' || (!r.isSystem && r.name.toLowerCase().includes('user')));
    if (!defaultRole && allRoles.length > 0) {
      defaultRole = allRoles[allRoles.length - 1];
    }

    if (!defaultRole) {
      const error = new Error('Cannot create account: No suitable default role found in database.');
      error.statusCode = 500;
      throw error;
    }

    // Generate random dummy password for OAuth users
    const dummyPassword = `GAuth_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const passwordHash = await hashPassword(dummyPassword);
    const newUser = await userRepo.createUser({
      email,
      passwordHash,
      firstName: given_name || email.split('@')[0],
      lastName: family_name || '',
      roleId: defaultRole.id,
      phone: null,
      profileImageUrl: picture || null,
      isActive: true,
    });
    user = await authRepo.findUserById(newUser.id);
  } else if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact an administrator.');
    error.statusCode = 403;
    throw error;
  }

  // Fetch permissions & menus
  const permissions = await authRepo.getUserEffectivePermissions(user.id, user.roleId);
  const menus = await authRepo.getUserMenuTree(user.id, user.roleId, user.role.slug);

  // Generate tokens matching authService.login exactly
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roleSlug: user.role.slug,
  });

  const refreshTokenPlain = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshTokenPlain);
  const refreshExpiresAt = new Date();
  refreshExpiresAt.setDate(refreshExpiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

  await authRepo.createRefreshToken(user.id, refreshTokenHash, refreshExpiresAt);

  // Log activity
  try {
    logActivity({
      userId: user.id,
      action: 'LOGIN_GOOGLE',
      module: 'auth',
      description: `User ${user.email} logged in via Google.`,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });
  } catch (e) {
    console.warn('Log activity warning during Google login:', e.message);
  }

  return {
    accessToken,
    refreshTokenPlain,
    user: authService.sanitizeUser(user),
    role: authService.sanitizeRole(user.role),
    permissions,
    menus,
  };
}

module.exports = { verifyGoogleTokenAndLogin };
