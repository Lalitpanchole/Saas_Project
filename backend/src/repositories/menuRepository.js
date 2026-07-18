/**
 * Menu Repository
 * 
 * Database operations for Menu model hierarchy and reordering.
 */

const prisma = require('../config/database');

async function findMenus({ includeInactive = false } = {}) {
  const where = includeInactive ? {} : { isActive: true };

  return prisma.menu.findMany({
    where,
    orderBy: [
      { position: 'asc' },
      { id: 'asc' },
    ],
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
    },
  });
}

async function findMenuById(id) {
  return prisma.menu.findUnique({
    where: { id: Number(id) },
    include: {
      children: {
        orderBy: { position: 'asc' },
      },
    },
  });
}

async function findMenuBySlug(slug) {
  return prisma.menu.findUnique({
    where: { slug },
  });
}

async function createMenu(data) {
  return prisma.menu.create({
    data,
  });
}

async function updateMenu(id, data) {
  return prisma.menu.update({
    where: { id: Number(id) },
    data,
  });
}

async function deleteMenu(id) {
  return prisma.menu.delete({
    where: { id: Number(id) },
  });
}

async function reorderMenus(items) {
  return prisma.$transaction(async (tx) => {
    for (const item of items) {
      await tx.menu.update({
        where: { id: Number(item.id) },
        data: {
          position: Number(item.position),
          parentId: item.parentId !== undefined ? (item.parentId === null ? null : Number(item.parentId)) : undefined,
        },
      });
    }
    return true;
  });
}

module.exports = {
  findMenus,
  findMenuById,
  findMenuBySlug,
  createMenu,
  updateMenu,
  deleteMenu,
  reorderMenus,
};
