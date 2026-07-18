/**
 * Menu Controller
 * 
 * Request handlers for Menu hierarchy endpoints.
 */

const menuService = require('../services/menuService');
const { sendSuccess } = require('../utils/response');

async function getMenus(req, res, next) {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const flat = req.query.flat === 'true';

    let menus;
    if (flat) {
      menus = await menuService.getMenusFlat({ includeInactive });
    } else {
      menus = await menuService.getMenusTree({ includeInactive });
    }

    return sendSuccess(res, menus, 'Menus retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function getMenuById(req, res, next) {
  try {
    const menu = await menuService.getMenuById(req.params.id);
    return sendSuccess(res, menu, 'Menu details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function createMenu(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const newMenu = await menuService.createMenu(req.body, req.user.userId, meta);
    return sendSuccess(res, newMenu, 'Menu created successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function updateMenu(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await menuService.updateMenu(req.params.id, req.body, req.user.userId, meta);
    return sendSuccess(res, updated, 'Menu updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function deleteMenu(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    await menuService.deleteMenu(req.params.id, req.user.userId, meta);
    return sendSuccess(res, {}, 'Menu deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function reorderMenus(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const tree = await menuService.reorderMenus(req.body.items || [], req.user.userId, meta);
    return sendSuccess(res, tree, 'Menu items reordered successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
};
