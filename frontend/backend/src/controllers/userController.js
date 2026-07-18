/**
 * User Controller
 * 
 * HTTP request handlers for User administration.
 */

const userService = require('../services/userService');
const { sendSuccess, sendPaginated } = require('../utils/response');

async function getUsers(req, res, next) {
  try {
    const { page, limit, search, roleId, isActive } = req.query;
    const { total, users } = await userService.getUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: search || '',
      roleId,
      isActive,
    });

    return sendPaginated(
      res,
      users,
      {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        total,
      }
    );
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user, 'User details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const newUser = await userService.createUser(
      req.body,
      req.user.userId,
      req.user.roleSlug,
      meta
    );

    return sendSuccess(res, newUser, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await userService.updateUser(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.roleSlug,
      meta
    );

    return sendSuccess(res, updated, 'User updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
      actorRoleSlug: req.user.roleSlug,
    };

    const updated = await userService.updateUserStatus(
      req.params.id,
      req.body.isActive,
      req.user.userId,
      meta
    );

    return sendSuccess(res, updated, 'User status updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    await userService.deleteUser(req.params.id, req.user.userId, meta);

    return sendSuccess(res, {}, 'User deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function getUserPermissions(req, res, next) {
  try {
    const data = await userService.getUserPermissions(req.params.id);
    return sendSuccess(res, data, 'User permission overrides retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function setUserPermissions(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const data = await userService.setUserPermissions(
      req.params.id,
      req.body.overrides || [],
      req.user.userId,
      meta
    );

    return sendSuccess(res, data, 'User permission overrides updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserPermissions,
  setUserPermissions,
};
