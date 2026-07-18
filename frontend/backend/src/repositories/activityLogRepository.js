/**
 * Activity Log Repository
 * 
 * Database access for querying audit trails.
 */

const prisma = require('../config/database');

async function findLogs({ page = 1, limit = 20, search = '', moduleSlug, action, userId, startDate, endDate }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { description: { contains: search } },
      { action: { contains: search } },
      { module: { contains: search } },
      { user: { email: { contains: search } } },
    ];
  }
  if (moduleSlug) where.module = moduleSlug;
  if (action) where.action = action;
  if (userId) where.userId = Number(userId);
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [total, logs] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return { total, logs };
}

module.exports = {
  findLogs,
};
