/**
 * Theme Routes
 * 
 * Maps /api/settings/theme endpoints with RBAC authorization.
 */

const express = require('express');
const router = express.Router();

const themeController = require('../controllers/themeController');
const { updateThemeValidator } = require('../validators/themeValidator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

// Public or authenticated get theme (allow public or check auth? Usually get theme can be public or authenticated so app header can load it. Let's make GET /theme public or optional, and PUT required).
router.get('/theme', themeController.getTheme);

router.put('/theme', authenticate, authorizePermission('settings', 'canUpdate'), updateThemeValidator, validate, themeController.updateTheme);

module.exports = router;
