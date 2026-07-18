/**
 * Theme Validator
 * 
 * express-validator schemas verifying app settings requests.
 */

const { body } = require('express-validator');

const updateThemeValidator = [
  body('appName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Application name cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Application name cannot exceed 100 characters.'),
  body('logoUrl')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Logo URL cannot exceed 255 characters.'),
  body('faviconUrl')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Favicon URL cannot exceed 255 characters.'),
  body('primaryColor')
    .optional()
    .trim()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('Primary color must be a valid hex color code (e.g. #0d6efd).'),
  body('secondaryColor')
    .optional()
    .trim()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('Secondary color must be a valid hex color code (e.g. #6c757d).'),
  body('sidebarColor')
    .optional()
    .trim()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('Sidebar color must be a valid hex color code (e.g. #0f172a).'),
  body('fontFamily')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Font family cannot exceed 100 characters.'),
  body('fontSize')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Font size cannot exceed 20 characters.'),
  body('textColor')
    .optional()
    .trim()
    .matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .withMessage('Text color must be a valid hex color code (e.g. #212529).'),
];

module.exports = {
  updateThemeValidator,
};
