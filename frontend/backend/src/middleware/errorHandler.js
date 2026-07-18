/**
 * Central Error Handler Middleware
 * 
 * Catches all unhandled errors and returns standardized JSON responses.
 * Never leaks stack traces or internal details in production.
 * 
 * References:
 *   - ARCHITECTURE.md §14 (Error handling)
 *   - API_CONTRACT.md §3 (Error response format)
 */

const env = require('../config/env');

/**
 * Express error-handling middleware (4 arguments).
 */
function errorHandler(err, req, res, _next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Log errors internally (clean line for 4xx client errors, full trace for 5xx server errors)
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] ❌ Server Error (${req.method} ${req.originalUrl}):`, err);
  } else if (statusCode !== 401 || !req.originalUrl.includes('/auth/refresh')) {
    console.warn(`[${new Date().toISOString()}] ⚠️ Client Error ${statusCode} (${req.method} ${req.originalUrl}): ${message}`);
  }

  // ── Prisma Errors ──────────────────────────────────────────────────────────
  if (err.code && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = err.meta?.target;
        const field = Array.isArray(target) ? target[0] : target || 'field';
        statusCode = 409;
        message = 'A record with this value already exists.';
        errors = [{ field, message: `The ${field} is already in use.` }];
        break;
      }
      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'The requested resource was not found.';
        break;
      case 'P2003':
        // Foreign key constraint failure
        statusCode = 400;
        message = 'This operation references a record that does not exist.';
        break;
      default:
        statusCode = 500;
        message = 'A database error occurred.';
    }
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid or malformed token.';
    errors = [];
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired.';
    errors = [];
  }

  // ── Suppress stack traces in production ─────────────────────────────────────
  if (env.isProduction) {
    // Don't leak internal server error details
    if (statusCode === 500) {
      message = 'Internal server error';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = errorHandler;
