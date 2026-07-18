/**
 * Menu Routes
 * 
 * Maps /api/menus endpoints protected by RBAC authorization.
 */

const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const {
  createMenuValidator,
  updateMenuValidator,
  reorderMenusValidator,
} = require('../validators/menuValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

// All endpoints require authentication
router.use(authenticate);

// Reorder menus (must come before /:id) (requires can_update on 'menus' module)
router.put('/reorder', authorizePermission('menus', 'canUpdate'), reorderMenusValidator, validate, menuController.reorderMenus);

// List menus (requires can_view on 'menus' module)
router.get('/', authorizePermission('menus', 'canView'), menuController.getMenus);

// Create menu item (requires can_create on 'menus' module)
router.post('/', authorizePermission('menus', 'canCreate'), createMenuValidator, validate, menuController.createMenu);

// Get menu details (requires can_view on 'menus' module)
router.get('/:id', authorizePermission('menus', 'canView'), menuController.getMenuById);

// Update menu item (requires can_update on 'menus' module)
router.put('/:id', authorizePermission('menus', 'canUpdate'), updateMenuValidator, validate, menuController.updateMenu);

// Delete menu item (requires can_delete on 'menus' module)
router.delete('/:id', authorizePermission('menus', 'canDelete'), menuController.deleteMenu);

module.exports = router;
