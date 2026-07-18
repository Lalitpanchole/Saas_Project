/**
 * Role Validator
 * 
 * express-validator schemas verifying role management requests.
 */

const { body } = require('express-validator');

const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Role name is required.')
    .isLength({ max: 50 })
    .withMessage('Role name cannot exceed 50 characters.'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Role slug is required.')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Role slug must consist only of lowercase letters, numbers, and underscores.')
    .isLength({ max: 50 })
    .withMessage('Role slug cannot exceed 50 characters.'),
];

const updateRoleValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Role name cannot be empty if provided.')
    .isLength({ max: 50 })
    .withMessage('Role name cannot exceed 50 characters.'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Role slug must consist only of lowercase letters, numbers, and underscores.')
    .isLength({ max: 50 })
    .withMessage('Role slug cannot exceed 50 characters.'),
];

const updateRolePermissionsValidator = [
  body('permissions')
    .isArray()
    .withMessage('Permissions must be an array.'),
  body('permissions.*.menuId')
    .isInt()
    .withMessage('Each permission entry must have a valid integer menuId.'),
];

module.exports = {
  createRoleValidator,
  updateRoleValidator,
  updateRolePermissionsValidator,
};
