/**
 * Permission Controller
 * 
 * Handles global Permission Matrix retrieval and batch updates across all roles and menus.
 * References:
 *   - ARCHITECTURE.md §9 (Permission Resolution & Management)
 *   - BUSINESS_RULES.md §5 (Role & Permission Rules)
 */

const prisma = require('../config/database');
const { sendSuccess } = require('../utils/response');
const { logActivity } = require('../services/activityLogService');

/**
 * GET /api/permissions/matrix
 */
async function getMatrix(req, res, next) {
  try {
    const [roles, menus, permissions] = await Promise.all([
      prisma.role.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, name: true, slug: true, isSystem: true },
      }),
      prisma.menu.findMany({
        where: { isActive: true },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true, name: true, slug: true, parentId: true },
      }),
      prisma.rolePermission.findMany(),
    ]);

    const permMap = new Map();
    permissions.forEach((p) => {
      permMap.set(`${p.roleId}_${p.menuId}`, p);
    });

    const matrix = roles.map((role) => {
      const isSuper = role.slug === 'super_admin';
      const roleMenus = menus.map((menu) => {
        const p = permMap.get(`${role.id}_${menu.id}`) || {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        };
        return {
          menuId: menu.id,
          menuSlug: menu.slug,
          menuName: menu.name,
          canView: isSuper ? true : p.canView,
          canCreate: isSuper ? true : p.canCreate,
          canUpdate: isSuper ? true : p.canUpdate,
          canDelete: isSuper ? true : p.canDelete,
        };
      });

      return {
        roleId: role.id,
        roleName: role.name,
        roleSlug: role.slug,
        isSystem: role.isSystem,
        permissions: roleMenus,
      };
    });

    return sendSuccess(res, { roles: matrix, menus }, 'Permission matrix retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/permissions/matrix
 */
async function updateMatrix(req, res, next) {
  try {
    const { updates = [] } = req.body; // Array of { roleId, menuId, canView, canCreate, canUpdate, canDelete }

    await prisma.$transaction(async (tx) => {
      for (const item of updates) {
        const role = await tx.role.findUnique({
          where: { id: Number(item.roleId) },
          select: { slug: true },
        });

        // Skip super_admin modifications
        if (!role || role.slug === 'super_admin') continue;

        await tx.rolePermission.upsert({
          where: {
            roleId_menuId: {
              roleId: Number(item.roleId),
              menuId: Number(item.menuId),
            },
          },
          update: {
            canView: Boolean(item.canView),
            canCreate: Boolean(item.canCreate),
            canUpdate: Boolean(item.canUpdate),
            canDelete: Boolean(item.canDelete),
          },
          create: {
            roleId: Number(item.roleId),
            menuId: Number(item.menuId),
            canView: Boolean(item.canView),
            canCreate: Boolean(item.canCreate),
            canUpdate: Boolean(item.canUpdate),
            canDelete: Boolean(item.canDelete),
          },
        });
      }
    });

    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    logActivity({
      userId: req.user.userId,
      action: 'PERMISSION_MATRIX_UPDATE',
      module: 'permissions',
      description: 'Updated global permission matrix across multiple roles.',
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return getMatrix(req, res, next);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMatrix,
  updateMatrix,
};
