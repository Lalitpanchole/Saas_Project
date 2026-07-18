/**
 * Theme Service
 * 
 * Business logic for retrieving and updating application theme & settings.
 */

const themeRepo = require('../repositories/themeRepository');
const { logActivity } = require('./activityLogService');

async function getTheme() {
  return themeRepo.getSetting();
}

async function updateTheme(data, actorId, meta = {}) {
  const current = await themeRepo.getSetting();

  const updateData = {};
  if (data.appName !== undefined) updateData.appName = data.appName.trim();
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl ? data.logoUrl.trim() : null;
  if (data.faviconUrl !== undefined) updateData.faviconUrl = data.faviconUrl ? data.faviconUrl.trim() : null;
  if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor.trim();
  if (data.secondaryColor !== undefined) updateData.secondaryColor = data.secondaryColor.trim();
  if (data.sidebarColor !== undefined) updateData.sidebarColor = data.sidebarColor.trim();
  if (data.fontFamily !== undefined) updateData.fontFamily = data.fontFamily.trim();
  if (data.fontSize !== undefined) updateData.fontSize = data.fontSize.trim();
  if (data.textColor !== undefined) updateData.textColor = data.textColor.trim();

  const updated = await themeRepo.updateSetting(current.id, updateData);

  logActivity({
    userId: actorId,
    action: 'THEME_UPDATE',
    module: 'settings',
    description: `Updated application theme & settings (${updated.appName}).`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

module.exports = {
  getTheme,
  updateTheme,
};
