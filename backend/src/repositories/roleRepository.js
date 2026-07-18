/**
 * Role Repository
 * 
 * Database access layer for Role and RolePermission entities.
 */

const prisma = require('../config/database');

async function findRoles({ search = '' } = {}) {
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
    ];
  }

  return prisma.role.findMany({
    where,
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      isSystem: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
}

async function findRoleById(id) {
  return prisma.role.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      slug: true,
      isSystem: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
}

async function findRoleByNameOrSlug(name, slug) {
  return prisma.role.findFirst({
    where: {
      OR: [
        { name },
        { slug },
      ],
    },
  });
}

async function createRole(data) {
  return prisma.role.create({
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      isSystem: true,
      createdAt: true,
    },
  });
}

async function updateRole(id, data) {
  return prisma.role.update({
    where: { id: Number(id) },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      isSystem: true,
      createdAt: true,
    },
  });
}

async function deleteRole(id) {
  return prisma.role.delete({
    where: { id: Number(id) },
  });
}

async function getRolePermissionsDetail(roleId) {
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

  const roleMap = new Map();
  rolePermissions.forEach((rp) => roleMap.set(rp.menuId, rp));

  return menus.map((menu) => {
    const rp = roleMap.get(menu.id) || {
      canView: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
    };

    return {
      menuId: menu.id,
      menuSlug: menu.slug,
      menuName: menu.name,
      canView: rp.canView,
      canCreate: rp.canCreate,
      canUpdate: rp.canUpdate,
      canDelete: rp.canDelete,
    };
  });
}

async function saveRolePermissions(roleId, permissionsList) {
  return prisma.$transaction(async (tx) => {
    // Clear existing permissions for this role
    await tx.rolePermission.deleteMany({
      where: { roleId: Number(roleId) },
    });

    const toInsert = permissionsList.map((item) => ({
      roleId: Number(roleId),
      menuId: Number(item.menuId),
      canView: Boolean(item.canView),
      canCreate: Boolean(item.canCreate),
      canUpdate: Boolean(item.canUpdate),
      canDelete: Boolean(item.canDelete),
    }));

    if (toInsert.length > 0) {
      await tx.rolePermission.createMany({
        data: toInsert,
      });
    }

    return true;
  });
}

module.exports = {
  findRoles,
  findRoleById,
  findRoleByNameOrSlug,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissionsDetail,
  saveRolePermissions,
};
