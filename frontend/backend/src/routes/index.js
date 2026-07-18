/**
 * Master API Router
 * 
 * Mounts all modular routers under /api prefix.
 * References:
 *   - ARCHITECTURE.md §4 (Backend structure and routes)
 *   - API_CONTRACT.md §1 (Base path /api)
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const roleRoutes = require('./roleRoutes');
const menuRoutes = require('./menuRoutes');
const permissionRoutes = require('./permissionRoutes');
const activityLogRoutes = require('./activityLogRoutes');
const themeRoutes = require('./themeRoutes');
const profileRoutes = require('./profileRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/menus', menuRoutes);
router.use('/permissions', permissionRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/settings', themeRoutes);
router.use('/profile', profileRoutes);

// Additional routes (users, roles, menus, permissions, activity-logs, settings, profile)
// will be mounted here in Phase 4.

module.exports = router;
