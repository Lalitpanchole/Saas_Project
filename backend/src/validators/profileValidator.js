/**
 * Profile Validator
 * 
 * express-validator schemas verifying profile update requests.
 */

const { body } = require('express-validator');

const updateProfileValidator = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty if provided.')
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters.'),
  body('lastName')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Last name cannot exceed 100 characters.'),
  body('phone')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters.'),
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must include uppercase, lowercase, number, and special character.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password.')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match.');
      }
      return true;
    }),
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
};
