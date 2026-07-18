/**
 * Database Configuration
 * 
 * Exports the Prisma client singleton for use across the backend.
 * All database access should import from this module.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
