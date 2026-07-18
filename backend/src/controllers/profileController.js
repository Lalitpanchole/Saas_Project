/**
 * Profile Controller
 * 
 * Handlers for personal profile retrieval, updates, password change, and image upload.
 */

const profileService = require('../services/profileService');
const { sendSuccess } = require('../utils/response');
const env = require('../config/env');

async function getProfile(req, res, next) {
  try {
    const user = await profileService.getProfile(req.user.userId);
    return sendSuccess(res, user, 'Profile details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await profileService.updateProfile(req.user.userId, req.body, meta);
    return sendSuccess(res, updated, 'Profile updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const { currentPassword, newPassword } = req.body;
    await profileService.changePassword(req.user.userId, currentPassword, newPassword, meta);

    // Clear refresh token cookie since all sessions are revoked
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: 'strict',
    });

    return sendSuccess(
      res,
      {},
      'Password changed successfully. Please log in again with your new password.',
      200
    );
  } catch (err) {
    next(err);
  }
}

async function uploadProfileImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.',
        errors: [],
      });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;
    const meta = {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const updated = await profileService.uploadProfileImage(req.user.userId, imageUrl, meta);
    return sendSuccess(res, updated, 'Profile image uploaded successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
};
