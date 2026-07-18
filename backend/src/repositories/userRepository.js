/**
 * User Repository
 * 
 * Database access layer for User entity and UserPermissionOverride.
 * References:
 *   - ARCHITECTURE.md §4 (Repositories layer)
 *   - BUSINESS_RULES.md §3 (User rules)
 */

const prisma = require('../config/database');

/**
 * Find paginated list of users with filtering.
 */
async function findUsers({ page = 1, limit = 10, search = '', roleId, isActive }) {
  const skip = (page - 1) * limit;

  const where = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (roleId !== undefined && roleId !== null && roleId !== '') {
    where.roleId = Number(roleId);
  }
  if (isActive !== undefined && isActive !== null && isActive !== '') {
    where.isActive = isActive === 'true' || isActive === true || isActive === '1' || isActive === 1;
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            slug: true,
            isSystem: true,
          },
        },
      },
    }),
  ]);

  return { total, users };
}

/**
 * Find user by ID with role and overrides.
 */
async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      profileImageUrl: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
          isSystem: true,
        },
      },
      userPermissionOverrides: {
        select: {
          id: true,
          menuId: true,
          canView: true,
          canCreate: true,
          canUpdate: true,
          canDelete: true,
          menu: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Find user by email.
 */
async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });
}

/**
 * Count active super admins.
 */
async function countActiveSuperAdmins() {
  return prisma.user.count({
    where: {
      isActive: true,
      role: {
        slug: 'super_admin',
      },
    },
  });
}

/**
 * Create user.
 */
async function createUser(data) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Update user.
 */
async function updateUser(id, data) {
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      isActive: true,
      roleId: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

/**
 * Delete user.
 */
async function deleteUser(id) {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
}

/**
 * Get user permission overrides along with all active menus and role defaults.
 */
async function getUserPermissionsDetail(userId, roleId) {
  const menus = await prisma.menu.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      parentId: true,
    },
  });

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId: Number(roleId) },
  });

  const userOverrides = await prisma.userPermissionOverride.findMany({
    where: { userId: Number(userId) },
  });

  const roleMap = new Map();
  rolePermissions.forEach((rp) => roleMap.set(rp.menuId, rp));

  const overrideMap = new Map();
  userOverrides.forEach((uo) => overrideMap.set(uo.menuId, uo));

  return menus.map((menu) => {
    const rp = roleMap.get(menu.id) || { canView: false, canCreate: false, canUpdate: false, canDelete: false };
    const uo = overrideMap.get(menu.id) || {};

    const effective = {
      canView: uo.canView !== undefined && uo.canView !== null ? uo.canView : rp.canView,
      canCreate: uo.canCreate !== undefined && uo.canCreate !== null ? uo.canCreate : rp.canCreate,
      canUpdate: uo.canUpdate !== undefined && uo.canUpdate !== null ? uo.canUpdate : rp.canUpdate,
      canDelete: uo.canDelete !== undefined && uo.canDelete !== null ? uo.canDelete : rp.canDelete,
    };

    return {
      menuId: menu.id,
      menuSlug: menu.slug,
      menuName: menu.name,
      rolePermissions: {
        canView: rp.canView,
        canCreate: rp.canCreate,
        canUpdate: rp.canUpdate,
        canDelete: rp.canDelete,
      },
      userOverrides: {
        canView: uo.canView ?? null,
        canCreate: uo.canCreate ?? null,
        canUpdate: uo.canUpdate ?? null,
        canDelete: uo.canDelete ?? null,
      },
      effectivePermissions: effective,
    };
  });
}

/**
 * Bulk save user permission overrides inside a transaction (BR-PERM-010).
 */
async function saveUserOverrides(userId, overridesList) {
  return prisma.$transaction(async (tx) => {
    // Clear existing overrides for this user
    await tx.userPermissionOverride.deleteMany({
      where: { userId: Number(userId) },
    });

    const toInsert = [];
    for (const item of overridesList) {
      // If any value is explicitly boolean (not null/undefined), store it
      if (
        item.canView !== null ||
        item.canCreate !== null ||
        item.canUpdate !== null ||
        item.canDelete !== null
      ) {
        toInsert.push({
          userId: Number(userId),
          menuId: Number(item.menuId),
          canView: item.canView ?? null,
          canCreate: item.canCreate ?? null,
          canUpdate: item.canUpdate ?? null,
          canDelete: item.canDelete ?? null,
        });
      }
    }

    if (toInsert.length > 0) {
      await tx.userPermissionOverride.createMany({
        data: toInsert,
      });
    }

    return true;
  });
}

module.exports = {
  findUsers,
  findUserById,
  findUserByEmail,
  countActiveSuperAdmins,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissionsDetail,
  saveUserOverrides,
};
