/**
 * Auth Validator
 * 
 * express-validator schemas verifying authentication request payloads.
 * References:
 *   - API_CONTRACT.md §6 (Auth endpoints validation requirements)
 *   - BUSINESS_RULES.md BR-AUTH-025/026 (Password reset validation rules)
 */

const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('The email address format is invalid.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('rememberMe must be a boolean.'),
  body('recaptchaToken')
    .optional()
    .isString(),
];

const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('The email address format is invalid.')
    .normalizeEmail(),
];

const validateResetTokenValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required.'),
];

const resetPasswordValidator = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required.'),
  body('password')
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),
];

module.exports = {
  loginValidator,
  forgotPasswordValidator,
  validateResetTokenValidator,
  resetPasswordValidator,
};
