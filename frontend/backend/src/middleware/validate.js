/**
 * Validation Middleware
 * 
 * Runs express-validator results and returns 422 with field-level errors
 * if validation fails.
 * 
 * References:
 *   - ARCHITECTURE.md §14 (Express Validator Middleware)
 *   - API_CONTRACT.md §3 (Error response format)
 *   - API_CONTRACT.md §5 (422 Unprocessable Entity)
 */

const { validationResult } = require('express-validator');

/**
 * Validates the request using express-validator chains.
 * If validation errors exist, returns 422 with field-level error details.
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: formattedErrors,
    });
  }

  next();
}

module.exports = validate;
