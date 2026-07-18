/**
 * Activity Log Service
 * 
 * Records audit trail entries for critical administrative actions.
 * 
 * References:
 *   - ARCHITECTURE.md §15 (Activity logging architecture)
 */

const prisma = require('../config/database');

/**
 * Create an activity log entry.
 * 
 * @param {{ userId?: number, action: string, module: string, description?: string, ipAddress?: string, userAgent?: string }} data
 */
async function logActivity({ userId = null, action, module, description = null, ipAddress = null, userAgent = null }) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        module,
        description,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    // Activity logging should never crash the request
    console.error('[ActivityLog] Failed to write log entry:', err.message);
  }
}

const logRepo = require('../repositories/activityLogRepository');

async function getLogs(params) {
  return logRepo.findLogs(params);
}

module.exports = { logActivity, getLogs };
