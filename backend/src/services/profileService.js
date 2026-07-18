/**
 * Profile Service
 * 
 * Business logic for self-service profile edits and password changes.
 * References:
 *   - BUSINESS_RULES.md BR-AUTH-028 (Require current password for change)
 *   - BUSINESS_RULES.md BR-AUTH-030 (Revoke refresh tokens on password change)
 */

const prisma = require('../config/database');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');
const { logActivity } = require('./activityLogService');

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function updateProfile(userId, data, meta = {}) {
  await getProfile(userId);

  const updateData = {};
  if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
  if (data.lastName !== undefined) updateData.lastName = data.lastName ? data.lastName.trim() : null;
  if (data.phone !== undefined) updateData.phone = data.phone ? data.phone.trim() : null;
  if (data.profileImageUrl !== undefined) updateData.profileImageUrl = data.profileImageUrl ? data.profileImageUrl.trim() : null;

  const updated = await prisma.user.update({
    where: { id: Number(userId) },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  logActivity({
    userId,
    action: 'PROFILE_UPDATE',
    module: 'profile',
    description: `User updated personal profile details.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

async function changePassword(userId, currentPassword, newPassword, meta = {}) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // Verify current password (BR-AUTH-028)
  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Incorrect current password.');
    error.statusCode = 401;
    throw error;
  }

  // Validate new password strength
  const strength = validatePasswordStrength(newPassword);
  if (!strength.valid) {
    const error = new Error(strength.message);
    error.statusCode = 422;
    throw error;
  }

  const newPasswordHash = await hashPassword(newPassword);

  // Execute in transaction: update password and revoke all active refresh tokens (BR-AUTH-030)
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: Number(userId) },
      data: { passwordHash: newPasswordHash },
    });

    await tx.refreshToken.updateMany({
      where: { userId: Number(userId), isRevoked: false },
      data: { isRevoked: true },
    });
  });

  logActivity({
    userId,
    action: 'PASSWORD_CHANGE',
    module: 'profile',
    description: `User successfully changed their password. All existing sessions revoked.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });
}

async function uploadProfileImage(userId, imageUrl, meta = {}) {
  const updated = await prisma.user.update({
    where: { id: Number(userId) },
    data: { profileImageUrl: imageUrl },
    select: {
      id: true,
      profileImageUrl: true,
    },
  });

  logActivity({
    userId,
    action: 'PROFILE_IMAGE_UPLOAD',
    module: 'profile',
    description: `User uploaded a new profile picture.`,
    ipAddress: meta.ip,
    userAgent: meta.userAgent,
  });

  return updated;
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
};
