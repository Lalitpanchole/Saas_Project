/**
 * Auth Routes
 * 
 * Maps /api/auth endpoints to validators and controllers.
 * References:
 *   - API_CONTRACT.md §6 (Auth endpoints)
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const {
  loginValidator,
  forgotPasswordValidator,
  validateResetTokenValidator,
  resetPasswordValidator,
} = require('../validators/authValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');

// Public endpoints
router.post('/login', loginValidator, validate, authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/validate-reset-token', validateResetTokenValidator, validate, authController.validateResetToken);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

// Protected endpoints
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.get('/my-permissions', authenticate, authController.getMyPermissions);
router.get('/my-menus', authenticate, authController.getMyMenus);

module.exports = router;
