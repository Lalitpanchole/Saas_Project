/**
 * Role Routes
 * 
 * Maps /api/roles endpoints protected by RBAC authorization.
 * References:
 *   - ARCHITECTURE.md §8 (authorizePermission)
 *   - BUSINESS_RULES.md §4 (Role management rules)
 */

const express = require('express');
const router = express.Router();

const roleController = require('../controllers/roleController');
const {
  createRoleValidator,
  updateRoleValidator,
  updateRolePermissionsValidator,
} = require('../validators/roleValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

// All endpoints require authentication
router.use(authenticate);

// List roles (requires can_view on 'roles' module)
router.get('/', authorizePermission('roles', 'canView'), roleController.getRoles);

// Create custom role (requires can_create on 'roles' module)
router.post('/', authorizePermission('roles', 'canCreate'), createRoleValidator, validate, roleController.createRole);

// Get role details (requires can_view on 'roles' module)
router.get('/:id', authorizePermission('roles', 'canView'), roleController.getRoleById);

// Update role details (requires can_update on 'roles' module)
router.put('/:id', authorizePermission('roles', 'canUpdate'), updateRoleValidator, validate, roleController.updateRole);

// Delete custom role (requires can_delete on 'roles' module)
router.delete('/:id', authorizePermission('roles', 'canDelete'), roleController.deleteRole);

// Get role permissions list across menus (requires can_view on 'roles' module)
router.get('/:id/permissions', authorizePermission('roles', 'canView'), roleController.getRolePermissions);

// Update role permissions list (requires can_update on 'roles' module)
router.put('/:id/permissions', authorizePermission('roles', 'canUpdate'), updateRolePermissionsValidator, validate, roleController.setRolePermissions);

module.exports = router;
