/**
 * Authorization Middleware
 * 
 * Provides role-based and permission-based access control.
 * Implements the Permission Resolution Algorithm from ARCHITECTURE.md §9.
 * 
 * References:
 *   - ARCHITECTURE.md §8 (authorizeRole, authorizePermission)
 *   - ARCHITECTURE.md §9 (Permission Resolution Algorithm)
 *   - BUSINESS_RULES.md BR-SADM-001/002 (Super Admin bypass)
 */

const { sendError } = require('../utils/response');
const prisma = require('../config/database');

/**
 * Role-based authorization.
 * Allows access if the user's role slug is in the provided list.
 * 
 * @param {...string} allowedRoles - Role slugs that are permitted
 * @returns {Function} Express middleware
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', [], 401);
    }

    // Super Admin always bypasses role checks (BR-SADM-001)
    if (req.user.roleSlug === 'super_admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.roleSlug)) {
      return sendError(res, 'You do not have permission to access this resource.', [], 403);
    }

    next();
  };
}

/**
 * Permission-based authorization using the Permission Resolution Algorithm.
 * 
 * Algorithm (ARCHITECTURE.md §9):
 *   1. If user role is super_admin → Allow
 *   2. Check user_permission_overrides for (userId, menuSlug, action)
 *      - If override exists and is NOT null → use override value
 *      - If override exists and IS null → fall through to role permission
 *   3. Check role_permissions for (roleId, menuSlug, action)
 *      - If true → Allow
 *      - Otherwise → Deny
 * 
 * @param {string} moduleSlug - The menu/module slug (e.g. 'users', 'roles')
 * @param {string} action - The action to check (e.g. 'canView', 'canCreate', 'canUpdate', 'canDelete')
 * @returns {Function} Express middleware
 */
function authorizePermission(moduleSlug, action) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return sendError(res, 'Authentication required.', [], 401);
      }

      // Step 1: Super Admin bypass (BR-SADM-001/002)
      if (req.user.roleSlug === 'super_admin') {
        return next();
      }

      const userId = req.user.userId;

      // Resolve the menu by slug
      const menu = await prisma.menu.findUnique({
        where: { slug: moduleSlug },
        select: { id: true },
      });

      if (!menu) {
        return sendError(res, 'You do not have permission to access this resource.', [], 403);
      }

      // Step 2: Check user-specific override
      const override = await prisma.userPermissionOverride.findUnique({
        where: {
          userMenuIdx: {
            userId,
            menuId: menu.id,
          },
        },
        select: {
          canView: true,
          canCreate: true,
          canUpdate: true,
          canDelete: true,
        },
      });

      if (override) {
        const overrideValue = override[action];
        // If override is not null, use the override value
        if (overrideValue !== null) {
          if (overrideValue === true) {
            return next();
          }
          return sendError(res, 'You do not have permission to perform this action.', [], 403);
        }
        // If override is null, fall through to role permission
      }

      // Step 3: Check role permission
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { roleId: true },
      });

      if (!user) {
        return sendError(res, 'User not found.', [], 401);
      }

      const rolePermission = await prisma.rolePermission.findUnique({
        where: {
          roleMenuIdx: {
            roleId: user.roleId,
            menuId: menu.id,
          },
        },
        select: {
          canView: true,
          canCreate: true,
          canUpdate: true,
          canDelete: true,
        },
      });

      if (rolePermission && rolePermission[action] === true) {
        return next();
      }

      return sendError(res, 'You do not have permission to perform this action.', [], 403);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  authorizeRole,
  authorizePermission,
};
