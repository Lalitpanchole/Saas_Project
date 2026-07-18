/**
 * Permission Routes
 * 
 * Maps /api/permissions endpoints protected by RBAC authorization.
 */

const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/permissionController');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

router.use(authenticate);

// Get global permission matrix (requires can_view on 'permissions' or 'roles' module)
router.get('/matrix', authorizePermission('roles', 'canView'), permissionController.getMatrix);

// Update global permission matrix (requires can_update on 'roles' module)
router.put('/matrix', authorizePermission('roles', 'canUpdate'), permissionController.updateMatrix);

module.exports = router;
