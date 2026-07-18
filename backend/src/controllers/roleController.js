/**
 * Role Controller
 * 
 * Request handlers for Role endpoints.
 */

const roleService = require('../services/roleService');
const { sendSuccess } = require('../utils/response');

async function getRoles(req, res, next) {
  try {
    const roles = await roleService.getRoles({ search: req.query.search || '' });
    return sendSuccess(res, roles, 'Roles retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await roleService.getRoleById(req.params.id);
    return sendSuccess(res, role, 'Role details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const newRole = await roleService.createRole(req.body, req.user.userId, meta);
    return sendSuccess(res, newRole, 'Role created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await roleService.updateRole(req.params.id, req.body, req.user.userId, meta);
    return sendSuccess(res, updated, 'Role updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    await roleService.deleteRole(req.params.id, req.user.userId, meta);
    return sendSuccess(res, {}, 'Role deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function getRolePermissions(req, res, next) {
  try {
    const data = await roleService.getRolePermissions(req.params.id);
    return sendSuccess(res, data, 'Role permissions retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function setRolePermissions(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const data = await roleService.setRolePermissions(
      req.params.id,
      req.body.permissions || [],
      req.user.userId,
      meta
    );
    return sendSuccess(res, data, 'Role permissions updated successfully', 200);
  } catch (err) {
    next(err);
  }
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
