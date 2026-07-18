/**
 * JWT Utility Functions
 * 
 * Handles access token generation/verification and refresh token creation.
 * 
 * References:
 *   - ARCHITECTURE.md §7 (Authentication Architecture)
 *   - BUSINESS_RULES.md BR-AUTH-005 (15 min access token expiry)
 *   - BUSINESS_RULES.md BR-AUTH-015/016 (Crypto-secure reset tokens, SHA256 hashing)
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * Generate a short-lived access JWT.
 * Payload contains: userId, email, roleSlug
 * Expiry: 15 minutes (BR-AUTH-005)
 * 
 * @param {{ userId: number, email: string, roleSlug: string }} payload
 * @returns {string} Signed JWT
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      roleSlug: payload.roleSlug,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY }
  );
}

/**
 * Verify and decode an access token.
 * 
 * @param {string} token
 * @returns {{ userId: number, email: string, roleSlug: string, iat: number, exp: number }}
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

/**
 * Generate a cryptographically secure random refresh token.
 * Returns 64 bytes as a hex string (128 characters).
 * 
 * @returns {string} Plain-text refresh token
 */
function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Hash a plain-text token using SHA256 for database storage.
 * Used for both refresh tokens and password reset tokens (BR-AUTH-016).
 * 
 * @param {string} plainToken
 * @returns {string} SHA256 hex digest
 */
function hashToken(plainToken) {
  return crypto.createHash('sha256').update(plainToken).digest('hex');
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashToken,
};
