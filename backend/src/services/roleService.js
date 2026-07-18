/**
 * Role Service
 * 
 * Business logic and rules enforcement for roles:
 *   - BR-ROLE-001/002: Unique name/slug
 *   - BR-ROLE-003: System roles cannot be deleted
 *   - BR-ROLE-005: Assigned roles protected
 *   - BR-ROLE-007: Audit logging
 */

const roleRepo = require('../repositories/roleRepository');
const { logActivity } = require('./activityLogService');

async function getRoles(params) {
  return roleRepo.findRoles(params);
}

async function getRoleById(id) {
  const role = await roleRepo.findRoleById(id);
  if (!role) {
    const error = new Error('Role not found.');
    error.statusCode = 404;
    throw error;
  }
  return role;
}

async function createRole(data, actorId, meta = {}) {
  // Check uniqueness (BR-ROLE-001 / BR-ROLE-002)
  const existing = await roleRepo.findRoleByNameOrSlug(data.name, data.slug);
  if (existing) {
    const error = new Error('A role with this name or slug already exists.');
    error.statusCode = 409;
    throw error;
  }

  const newRole = await roleRepo.createRole({
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    isSystem: false,
  });

  logActivity({
    userId: actorId,
    action: 'ROLE_CREATE',
    module: 'roles',
    description: `Created new custom role "${newRole.name}" (${newRole.slug}).`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return newRole;
}

async function updateRole(id, data, actorId, meta = {}) {
  const targetRole = await getRoleById(id);

  if (targetRole.isSystem && data.slug && data.slug !== targetRole.slug) {
    const error = new Error('Cannot change the slug of a system role.');
    error.statusCode = 403;
    throw error;
  }

  // Check unique name/slug if changing
  if (
    (data.name && data.name !== targetRole.name) ||
    (data.slug && data.slug !== targetRole.slug)
  ) {
    const existing = await roleRepo.findRoleByNameOrSlug(data.name || targetRole.name, data.slug || targetRole.slug);
    if (existing && existing.id !== Number(id)) {
      const error = new Error('Another role with this name or slug already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const updateData = {};
  if (data.name) updateData.name = data.name.trim();
  if (data.slug && !targetRole.isSystem) updateData.slug = data.slug.trim().toLowerCase();

  const updated = await roleRepo.updateRole(id, updateData);

  logActivity({
    userId: actorId,
    action: 'ROLE_UPDATE',
    module: 'roles',
    description: `Updated role "${updated.name}".`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

async function deleteRole(id, actorId, meta = {}) {
  const targetRole = await getRoleById(id);

  // System role protection (BR-ROLE-003)
  if (targetRole.isSystem) {
    const error = new Error('System roles cannot be deleted.');
    error.statusCode = 403;
    throw error;
  }

  // Assigned role protection (BR-ROLE-005)
  if (targetRole._count?.users > 0) {
    const error = new Error(`Cannot delete this role because it is currently assigned to ${targetRole._count.users} user(s). Reassign them first.`);
    error.statusCode = 409;
    throw error;
  }

  await roleRepo.deleteRole(id);

  logActivity({
    userId: actorId,
    action: 'ROLE_DELETE',
    module: 'roles',
    description: `Deleted custom role "${targetRole.name}".`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

async function getRolePermissions(id) {
  await getRoleById(id);
  return roleRepo.getRolePermissionsDetail(id);
}

async function setRolePermissions(id, permissionsList, actorId, meta = {}) {
  const targetRole = await getRoleById(id);

  if (targetRole.slug === 'super_admin') {
    const error = new Error('Super Admin permissions are hardcoded to full access and cannot be modified.');
    error.statusCode = 403;
    throw error;
  }

  await roleRepo.saveRolePermissions(id, permissionsList);

  logActivity({
    userId: actorId,
    action: 'ROLE_PERMISSIONS_UPDATE',
    module: 'roles',
    description: `Updated permission mappings for role "${targetRole.name}".`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return getRolePermissions(id);
}

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  setRolePermissions,
};
