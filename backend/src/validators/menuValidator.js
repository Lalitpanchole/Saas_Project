/**
 * Menu Validator
 * 
 * express-validator schemas verifying menu operations.
 */

const { body } = require('express-validator');

const createMenuValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu name is required.')
    .isLength({ max: 100 })
    .withMessage('Menu name cannot exceed 100 characters.'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Menu slug is required.')
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Menu slug must consist only of lowercase letters, numbers, and underscores.')
    .isLength({ max: 50 })
    .withMessage('Menu slug cannot exceed 50 characters.'),
  body('route')
    .trim()
    .notEmpty()
    .withMessage('Route is required.')
    .isLength({ max: 255 })
    .withMessage('Route cannot exceed 255 characters.'),
  body('parentId')
    .optional({ nullable: true })
    .isInt()
    .withMessage('parentId must be an integer or null.'),
  body('position')
    .optional()
    .isInt()
    .withMessage('position must be an integer.'),
];

const updateMenuValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Menu name cannot be empty if provided.')
    .isLength({ max: 100 })
    .withMessage('Menu name cannot exceed 100 characters.'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9_]+$/)
    .withMessage('Menu slug must consist only of lowercase letters, numbers, and underscores.')
    .isLength({ max: 50 })
    .withMessage('Menu slug cannot exceed 50 characters.'),
  body('route')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Route cannot be empty if provided.'),
  body('parentId')
    .optional({ nullable: true })
    .isInt()
    .withMessage('parentId must be an integer or null.'),
  body('position')
    .optional()
    .isInt()
    .withMessage('position must be an integer.'),
];

const reorderMenusValidator = [
  body('items')
    .isArray()
    .withMessage('Items must be an array.'),
  body('items.*.id')
    .isInt()
    .withMessage('Each item must have a valid integer id.'),
  body('items.*.position')
    .isInt()
    .withMessage('Each item must have a valid integer position.'),
];

module.exports = {
  createMenuValidator,
  updateMenuValidator,
  reorderMenusValidator,
};
