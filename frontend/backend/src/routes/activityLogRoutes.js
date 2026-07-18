/**
 * Activity Log Routes
 * 
 * Maps /api/activity-logs endpoints protected by RBAC authorization.
 */

const express = require('express');
const router = express.Router();

const activityLogController = require('../controllers/activityLogController');
const authenticate = require('../middleware/authenticate');
const { authorizePermission } = require('../middleware/authorize');

router.use(authenticate);

// Get activity logs (requires can_view on 'activity_logs' module)
router.get('/', authorizePermission('activity_logs', 'canView'), activityLogController.getLogs);

module.exports = router;
