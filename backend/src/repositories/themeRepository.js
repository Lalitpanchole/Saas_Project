/**
 * Theme & App Settings Repository
 * 
 * Database operations for AppSetting model.
 */

const prisma = require('../config/database');

async function getSetting() {
  let setting = await prisma.appSetting.findFirst();
  if (!setting) {
    setting = await prisma.appSetting.create({
      data: {
        appName: 'RBAC Starter',
        primaryColor: '#0d6efd',
        secondaryColor: '#6c757d',
        sidebarColor: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '14px',
        textColor: '#212529',
      },
    });
  }
  return setting;
}

async function updateSetting(id, data) {
  return prisma.appSetting.update({
    where: { id: Number(id) },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

module.exports = {
  getSetting,
  updateSetting,
};
