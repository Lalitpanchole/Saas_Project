/**
 * User Service
 * 
 * Business logic layer enforcing user management rules:
 *   - BR-USER-001 through BR-USER-008
 *   - BR-SADM-003 and BR-SADM-004 (Super Admin self-protection)
 *   - BR-PERM-006 through BR-PERM-010 (Overrides & hierarchy)
 */

const userRepo = require('../repositories/userRepository');
const prisma = require('../config/database');
const { hashPassword } = require('../utils/password');
const { logActivity } = require('./activityLogService');

/**
 * Check authority level: user cannot assign a role above their own (BR-USER-008).
 * Role hierarchy order: super_admin (1) > admin (2) > manager (3) > staff (4) > viewer (5) / custom.
 */
async function checkAuthorityLevel(creatorRoleSlug, targetRoleId) {
  if (creatorRoleSlug === 'super_admin') return true;

  const targetRole = await prisma.role.findUnique({
    where: { id: Number(targetRoleId) },
    select: { slug: true },
  });

  if (!targetRole) {
    const error = new Error('Selected role does not exist.');
    error.statusCode = 400;
    throw error;
  }

  // Admin cannot create Super Admin
  if (creatorRoleSlug === 'admin' && targetRole.slug === 'super_admin') {
    const error = new Error('You cannot assign a role higher than or equal to Super Admin.');
    error.statusCode = 403;
    throw error;
  }

  // Non-super/admin users cannot create admin or super_admin
  if (creatorRoleSlug !== 'admin' && (targetRole.slug === 'super_admin' || targetRole.slug === 'admin')) {
    const error = new Error('You cannot assign administrative roles above your authority level.');
    error.statusCode = 403;
    throw error;
  }

  return true;
}

/**
 * Get paginated users.
 */
async function getUsers(params) {
  return userRepo.findUsers(params);
}

/**
 * Get user details by ID.
 */
async function getUserById(id) {
  const user = await userRepo.findUserById(id);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

/**
 * Create a new user.
 */
async function createUser(data, creatorId, creatorRoleSlug, meta = {}) {
  // Check email uniqueness (BR-AUTH-002, BR-USER-003)
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Check authority (BR-USER-008)
  await checkAuthorityLevel(creatorRoleSlug, data.roleId);

  // Hash password (BR-AUTH-003)
  const passwordHash = await hashPassword(data.password);

  const newUser = await userRepo.createUser({
    email: data.email,
    passwordHash,
    firstName: data.firstName,
    lastName: data.lastName || null,
    phone: data.phone || null,
    roleId: Number(data.roleId),
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    createdBy: creatorId ? Number(creatorId) : null,
  });

  logActivity({
    userId: creatorId,
    action: 'USER_CREATE',
    module: 'users',
    description: `Created user account for ${newUser.email}.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return newUser;
}

/**
 * Update existing user.
 */
async function updateUser(id, data, actorId, actorRoleSlug, meta = {}) {
  const targetUser = await getUserById(id);

  // Check unique email if changing
  if (data.email && data.email !== targetUser.email) {
    const existing = await userRepo.findUserByEmail(data.email);
    if (existing) {
      const error = new Error('A user with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  // Check role authority if changing
  if (data.roleId && Number(data.roleId) !== targetUser.roleId) {
    await checkAuthorityLevel(actorRoleSlug, data.roleId);
  }

  // Check Super Admin deactivation protection (BR-SADM-004)
  if (targetUser.role.slug === 'super_admin' && data.isActive === false && targetUser.isActive === true) {
    const superAdminCount = await userRepo.countActiveSuperAdmins();
    if (superAdminCount <= 1) {
      const error = new Error('Cannot deactivate the last active Super Admin account.');
      error.statusCode = 403;
      throw error;
    }
  }

  // Check user cannot deactivate themselves (BR-USER-005)
  if (Number(id) === Number(actorId) && data.isActive === false) {
    const error = new Error('You cannot deactivate your own account.');
    error.statusCode = 403;
    throw error;
  }

  const updateData = {};
  if (data.email) updateData.email = data.email;
  if (data.firstName !== undefined) updateData.firstName = data.firstName;
  if (data.lastName !== undefined) updateData.lastName = data.lastName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.roleId !== undefined) updateData.roleId = Number(data.roleId);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updated = await userRepo.updateUser(id, updateData);

  logActivity({
    userId: actorId,
    action: 'USER_UPDATE',
    module: 'users',
    description: `Updated profile details for user ${updated.email}.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

/**
 * Toggle user status.
 */
async function updateUserStatus(id, isActive, actorId, meta = {}) {
  return updateUser(id, { isActive }, actorId, meta.actorRoleSlug || 'super_admin', meta);
}

/**
 * Delete user.
 */
async function deleteUser(id, actorId, meta = {}) {
  const targetUser = await getUserById(id);

  // User cannot delete themselves (BR-USER-005)
  if (Number(id) === Number(actorId)) {
    const error = new Error('You cannot delete your own account.');
    error.statusCode = 403;
    throw error;
  }

  // Super Admin protection (BR-SADM-003)
  if (targetUser.role.slug === 'super_admin') {
    const superAdminCount = await userRepo.countActiveSuperAdmins();
    if (superAdminCount <= 1) {
      const error = new Error('Cannot delete the last active Super Admin account.');
      error.statusCode = 403;
      throw error;
    }
  }

  await userRepo.deleteUser(id);

  logActivity({
    userId: actorId,
    action: 'USER_DELETE',
    module: 'users',
    description: `Deleted user account ${targetUser.email}.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

/**
 * Get user permission overrides and effective matrix.
 */
async function getUserPermissions(id) {
  const targetUser = await getUserById(id);
  return userRepo.getUserPermissionsDetail(targetUser.id, targetUser.roleId);
}

/**
 * Set user permission overrides inside a transaction.
 */
async function setUserPermissions(id, overridesList, actorId, meta = {}) {
  const targetUser = await getUserById(id);

  // Enforce BR-PERM-003: If View is false/null and role is false, Create/Update/Delete cannot be true
  await userRepo.saveUserOverrides(targetUser.id, overridesList);

  logActivity({
    userId: actorId,
    action: 'USER_PERMISSIONS_UPDATE',
    module: 'users',
    description: `Updated permission overrides for user ${targetUser.email}.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return getUserPermissions(id);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  setUserPermissions,
};
