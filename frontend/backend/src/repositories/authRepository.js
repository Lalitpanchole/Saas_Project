/**
 * Auth Repository
 * 
 * Database access layer for authentication-related operations.
 * No business logic — only Prisma Client queries and mutations.
 * 
 * References:
 *   - ARCHITECTURE.md §4 (Repository layer responsibilities)
 */

const prisma = require('../config/database');

/**
 * Find a user by email, including their role.
 * @param {string} email
 */
async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { role: true },
  });
}

/**
 * Find a user by ID, including their role.
 * @param {number} id
 */
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
}

// ─── Refresh Tokens ──────────────────────────────────────────────────────────

/**
 * Store a hashed refresh token in the database.
 */
async function createRefreshToken(userId, tokenHash, expiresAt) {
  return prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

/**
 * Find a refresh token by its hash.
 */
async function findRefreshToken(tokenHash) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: { include: { role: true } } },
  });
}

/**
 * Revoke a single refresh token by ID.
 */
async function revokeRefreshToken(id) {
  return prisma.refreshToken.update({
    where: { id },
    data: { isRevoked: true },
  });
}

/**
 * Revoke all active refresh tokens for a user (BR-AUTH-030/045).
 */
async function revokeAllUserRefreshTokens(userId) {
  return prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true },
  });
}

// ─── Password Reset Tokens ──────────────────────────────────────────────────

/**
 * Create a password reset token record.
 */
async function createPasswordResetToken(userId, tokenHash, expiresAt, requestIp) {
  return prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt, requestIp },
  });
}

/**
 * Find a password reset token by its hash.
 */
async function findPasswordResetToken(tokenHash) {
  return prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
}

/**
 * Mark a reset token as used (set used_at timestamp).
 */
async function markResetTokenUsed(id) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

/**
 * Invalidate all previous unused reset tokens for a user (BR-AUTH-021).
 */
async function invalidatePreviousResetTokens(userId) {
  return prisma.passwordResetToken.updateMany({
    where: {
      userId,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });
}

/**
 * Update a user's password hash.
 */
async function updateUserPassword(userId, passwordHash) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

// ─── Permissions & Menus ────────────────────────────────────────────────────

/**
 * Get effective permissions for a user (role + overrides).
 * Returns an array of { menuSlug, canView, canCreate, canUpdate, canDelete }.
 */
async function getUserEffectivePermissions(userId, roleId) {
  // Get all active, visible menus
  const menus = await prisma.menu.findMany({
    where: { isActive: true },
    select: { id: true, slug: true },
    orderBy: { position: 'asc' },
  });

  // Get role permissions for all menus
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    select: {
      menuId: true,
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    },
  });

  // Get user overrides for all menus
  const userOverrides = await prisma.userPermissionOverride.findMany({
    where: { userId },
    select: {
      menuId: true,
      canView: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
    },
  });

  // Build lookup maps
  const rolePermMap = new Map(rolePermissions.map((rp) => [rp.menuId, rp]));
  const overrideMap = new Map(userOverrides.map((uo) => [uo.menuId, uo]));

  // Resolve effective permissions per menu
  const result = menus.map((menu) => {
    const rolePerm = rolePermMap.get(menu.id) || {};
    const override = overrideMap.get(menu.id) || {};

    const resolve = (action) => {
      const overrideVal = override[action];
      if (overrideVal !== undefined && overrideVal !== null) {
        return overrideVal;
      }
      return rolePerm[action] || false;
    };

    return {
      menuSlug: menu.slug,
      canView: resolve('canView'),
      canCreate: resolve('canCreate'),
      canUpdate: resolve('canUpdate'),
      canDelete: resolve('canDelete'),
    };
  });

  return result;
}

/**
 * Get the dynamic menu tree for a user based on their effective view permissions.
 * Only returns menus where the user has canView = true.
 * Builds parent-child hierarchy per ARCHITECTURE.md §10.
 */
async function getUserMenuTree(userId, roleId, roleSlug) {
  // Super Admin sees all active menus
  const isSuperAdmin = roleSlug === 'super_admin';

  const allMenus = await prisma.menu.findMany({
    where: { isActive: true, isVisible: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      parentId: true,
      name: true,
      slug: true,
      route: true,
      icon: true,
      position: true,
      isDropdown: true,
      isVisible: true,
      isActive: true,
      children: false,
    },
  });

  let permittedMenuIds;

  if (isSuperAdmin) {
    permittedMenuIds = new Set(allMenus.map((m) => m.id));
  } else {
    // Resolve effective permissions to find which menus user can view
    const effectivePerms = await getUserEffectivePermissions(userId, roleId);
    const viewableSlugs = new Set(
      effectivePerms.filter((p) => p.canView).map((p) => p.menuSlug)
    );
    permittedMenuIds = new Set(
      allMenus.filter((m) => viewableSlugs.has(m.slug)).map((m) => m.id)
    );
  }

  // Build tree: Parent menu visible only if it has at least one permitted child
  const menuMap = new Map(allMenus.map((m) => [m.id, { ...m, children: [] }]));

  // Collect children under their parents
  for (const menu of menuMap.values()) {
    if (menu.parentId && menuMap.has(menu.parentId)) {
      menuMap.get(menu.parentId).children.push(menu);
    }
  }

  // Get root-level menus (no parentId)
  const rootMenus = allMenus
    .filter((m) => !m.parentId)
    .map((m) => menuMap.get(m.id));

  // Filter: include if permitted, or if parent with at least one permitted child
  const filterTree = (menus) => {
    return menus
      .map((menu) => {
        const filteredChildren = filterTree(menu.children);
        const isPermitted = permittedMenuIds.has(menu.id);
        const hasPermittedChildren = filteredChildren.length > 0;

        if (isPermitted || hasPermittedChildren) {
          return { ...menu, children: filteredChildren };
        }
        return null;
      })
      .filter(Boolean);
  };

  return filterTree(rootMenus);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  createPasswordResetToken,
  findPasswordResetToken,
  markResetTokenUsed,
  invalidatePreviousResetTokens,
  updateUserPassword,
  getUserEffectivePermissions,
  getUserMenuTree,
};
