/**
 * User Routes
 * 
 * Maps /api/users endpoints with authentication and permission checks.
 * References:
 *   - ARCHITECTURE.md §8 (authorizePermission)
 *   - BUSINESS_RULES.md §8 (CRUD rules)
 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const {
  createUserValidator,
  updateUserValidator,
  updateUserStatusValidator,
  updateUserPermissionsValidator,
} = require('../validators/userValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

// All endpoints require authentication
router.use(authenticate);

// List users (requires can_view on 'users' module)
router.get('/', authorizePermission('users', 'canView'), userController.getUsers);

// Create user (requires can_create on 'users' module)
router.post('/', authorizePermission('users', 'canCreate'), createUserValidator, validate, userController.createUser);

// Get user details (requires can_view on 'users' module)
router.get('/:id', authorizePermission('users', 'canView'), userController.getUserById);

// Update user details (requires can_update on 'users' module)
router.put('/:id', authorizePermission('users', 'canUpdate'), updateUserValidator, validate, userController.updateUser);

// Update user active status (requires can_update on 'users' module)
router.patch('/:id/status', authorizePermission('users', 'canUpdate'), updateUserStatusValidator, validate, userController.updateUserStatus);

// Delete user (requires can_delete on 'users' module)
router.delete('/:id', authorizePermission('users', 'canDelete'), userController.deleteUser);

// Get user permission overrides (requires can_view on 'users' module)
router.get('/:id/permissions', authorizePermission('users', 'canView'), userController.getUserPermissions);
router.get('/:id/overrides', authorizePermission('users', 'canView'), userController.getUserPermissions);

// Update user permission overrides (requires can_update on 'users' module)
router.put('/:id/permissions', authorizePermission('users', 'canUpdate'), updateUserPermissionsValidator, validate, userController.setUserPermissions);
router.put('/:id/overrides', authorizePermission('users', 'canUpdate'), updateUserPermissionsValidator, validate, userController.setUserPermissions);

module.exports = router;
