/**
 * Theme Controller
 * 
 * Request handlers for App Settings & Theme configuration.
 */

const themeService = require('../services/themeService');
const { sendSuccess } = require('../utils/response');

async function getTheme(req, res, next) {
  try {
    const setting = await themeService.getTheme();
    return sendSuccess(res, setting, 'Theme settings retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function updateTheme(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await themeService.updateTheme(req.body, req.user.userId, meta);
    return sendSuccess(res, updated, 'Theme settings updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTheme,
  updateTheme,
};
