/**
 * Standardized API Response Helpers
 * 
 * Ensures all API responses follow the formats defined in API_CONTRACT.md §2-4.
 */

/**
 * Send a standard success response.
 * Format: { success: true, message: "...", data: {} }
 * 
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} [message='Operation completed successfully']
 * @param {number} [statusCode=200]
 */
function sendSuccess(res, data = {}, message = 'Operation completed successfully', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send a standard error response.
 * Format: { success: false, message: "...", errors: [] }
 * 
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array<{ field?: string, message: string }>} [errors=[]]
 * @param {number} [statusCode=400]
 */
function sendError(res, message = 'An error occurred', errors = [], statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

/**
 * Send a paginated success response.
 * Format: { success: true, data: [], pagination: { page, limit, total, totalPages } }
 * 
 * @param {import('express').Response} res
 * @param {Array} data
 * @param {{ page: number, limit: number, total: number }} pagination
 */
function sendPaginated(res, data = [], pagination = {}) {
  const { page = 1, limit = 10, total = 0 } = pagination;
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
