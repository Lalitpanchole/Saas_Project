/**
 * Menu Service
 * 
 * Business logic layer for Menu hierarchy rules:
 *   - BR-MENU-001: Unique slugs
 *   - BR-MENU-002: Hierarchy validation (prevent self-parenting cycles)
 *   - BR-MENU-003: Order sorting
 */

const menuRepo = require('../repositories/menuRepository');
const { logActivity } = require('./activityLogService');

/**
 * Build nested menu tree from flat array.
 */
function buildTree(flatList, parentId = null) {
  return flatList
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(flatList, item.id),
    }));
}

async function getMenusTree({ includeInactive = false } = {}) {
  const flatList = await menuRepo.findMenus({ includeInactive });
  return buildTree(flatList, null);
}

async function getMenusFlat({ includeInactive = true } = {}) {
  return menuRepo.findMenus({ includeInactive });
}

async function getMenuById(id) {
  const menu = await menuRepo.findMenuById(id);
  if (!menu) {
    const error = new Error('Menu item not found.');
    error.statusCode = 404;
    throw error;
  }
  return menu;
}

async function createMenu(data, actorId, meta = {}) {
  const existing = await menuRepo.findMenuBySlug(data.slug);
  if (existing) {
    const error = new Error('A menu item with this slug already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Validate parentId if provided
  if (data.parentId) {
    const parent = await menuRepo.findMenuById(data.parentId);
    if (!parent) {
      const error = new Error('Parent menu item does not exist.');
      error.statusCode = 400;
      throw error;
    }
  }

  const newMenu = await menuRepo.createMenu({
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    route: data.route.trim(),
    icon: data.icon || null,
    parentId: data.parentId ? Number(data.parentId) : null,
    position: data.position !== undefined ? Number(data.position) : 0,
    isDropdown: Boolean(data.isDropdown),
    isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
  });

  logActivity({
    userId: actorId,
    action: 'MENU_CREATE',
    module: 'menus',
    description: `Created menu item "${newMenu.name}" (${newMenu.slug}).`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return newMenu;
}

async function updateMenu(id, data, actorId, meta = {}) {
  const targetMenu = await getMenuById(id);

  if (data.slug && data.slug !== targetMenu.slug) {
    const existing = await menuRepo.findMenuBySlug(data.slug);
    if (existing && existing.id !== Number(id)) {
      const error = new Error('Another menu item with this slug already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  // Prevent self-parenting
  if (data.parentId && Number(data.parentId) === Number(id)) {
    const error = new Error('A menu item cannot be its own parent.');
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.slug !== undefined) updateData.slug = data.slug.trim().toLowerCase();
  if (data.route !== undefined) updateData.route = data.route.trim();
  if (data.icon !== undefined) updateData.icon = data.icon || null;
  if (data.parentId !== undefined) updateData.parentId = data.parentId ? Number(data.parentId) : null;
  if (data.position !== undefined) updateData.position = Number(data.position);
  if (data.isDropdown !== undefined) updateData.isDropdown = Boolean(data.isDropdown);
  if (data.isVisible !== undefined) updateData.isVisible = Boolean(data.isVisible);
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

  const updated = await menuRepo.updateMenu(id, updateData);

  logActivity({
    userId: actorId,
    action: 'MENU_UPDATE',
    module: 'menus',
    description: `Updated menu item "${updated.name}".`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

async function deleteMenu(id, actorId, meta = {}) {
  const targetMenu = await getMenuById(id);

  await menuRepo.deleteMenu(id);

  logActivity({
    userId: actorId,
    action: 'MENU_DELETE',
    module: 'menus',
    description: `Deleted menu item "${targetMenu.name}".`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

async function reorderMenus(items, actorId, meta = {}) {
  await menuRepo.reorderMenus(items);

  logActivity({
    userId: actorId,
    action: 'MENU_REORDER',
    module: 'menus',
    description: `Reordered menu items.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return getMenusTree({ includeInactive: true });
}

module.exports = {
  getMenusTree,
  getMenusFlat,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
};
