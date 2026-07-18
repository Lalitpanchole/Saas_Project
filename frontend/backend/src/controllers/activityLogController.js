/**
 * Activity Log Controller
 * 
 * Request handler for audit trail querying.
 */

const activityLogService = require('../services/activityLogService');
const { sendPaginated } = require('../utils/response');

async function getLogs(req, res, next) {
  try {
    const { page, limit, search, module: moduleSlug, action, userId, startDate, endDate } = req.query;

    const { total, logs } = await activityLogService.getLogs({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search: search || '',
      moduleSlug,
      action,
      userId,
      startDate,
      endDate,
    });

    return sendPaginated(
      res,
      logs,
      {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        total,
      }
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLogs,
};
