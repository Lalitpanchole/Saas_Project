/**
 * User Validator
 * 
 * express-validator schemas verifying user management payloads.
 */

const { body, param, query } = require('express-validator');

const createUserValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Invalid email format.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include uppercase, lowercase, number, and special character.'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required.')
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters.'),
  body('roleId')
    .notEmpty()
    .withMessage('Role ID is required.')
    .isInt()
    .withMessage('Role ID must be an integer.'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean.'),
];

const updateUserValidator = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email format.')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include uppercase, lowercase, number, and special character.'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters.'),
  body('roleId')
    .optional()
    .isInt()
    .withMessage('Role ID must be an integer.'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be boolean.'),
];

const updateUserStatusValidator = [
  body('isActive')
    .notEmpty()
    .withMessage('isActive status is required.')
    .isBoolean()
    .withMessage('isActive must be boolean.'),
];

const updateUserPermissionsValidator = [
  body('overrides')
    .isArray()
    .withMessage('Overrides must be an array.'),
  body('overrides.*.menuId')
    .isInt()
    .withMessage('Each override must have a valid integer menuId.'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  updateUserStatusValidator,
  updateUserPermissionsValidator,
};
