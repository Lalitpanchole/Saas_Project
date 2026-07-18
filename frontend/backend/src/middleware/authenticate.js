/**
 * Authentication Middleware
 * 
 * Parses the Authorization header, verifies the JWT access token,
 * checks user active status, and attaches user context to the request.
 * 
 * References:
 *   - ARCHITECTURE.md §7.7 (Account status validation on every request)
 *   - ARCHITECTURE.md §8 (authenticate middleware)
 *   - BUSINESS_RULES.md BR-AUTH-001 (Only active users can access)
 */

const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const prisma = require('../config/database');

/**
 * Authenticate middleware.
 * Extracts Bearer token, verifies JWT, checks user is active,
 * and sets req.user = { userId, email, roleSlug }.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please log in.', [], 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', [], 401);
    }

    // Verify JWT signature and expiry
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token has expired.', [], 401);
      }
      return sendError(res, 'Invalid or malformed token.', [], 401);
    }

    // Check that user is still active (BR-AUTH-001, ARCHITECTURE.md §7.7)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return sendError(res, 'Account is deactivated or does not exist.', [], 401);
    }

    // Attach user context to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleSlug: decoded.roleSlug,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
