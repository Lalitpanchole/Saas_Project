/**
 * Password Utility Functions
 * 
 * Handles password hashing, comparison, and strength validation.
 * 
 * References:
 *   - BUSINESS_RULES.md BR-AUTH-003 (bcrypt, salt >= 10)
 *   - API_CONTRACT.md §15 (Password validation rules)
 */

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Password strength regex.
 * Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * Hash a plain-text password using bcrypt.
 * 
 * @param {string} plainPassword
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * 
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Validate password meets strength requirements.
 * 
 * @param {string} password
 * @returns {{ valid: boolean, message?: string }}
 */
function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    };
  }
  return { valid: true };
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  PASSWORD_REGEX,
};
