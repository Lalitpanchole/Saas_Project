/**
 * Server Entry Point
 * 
 * Binds the Express app to a network port and checks database connectivity.
 * References:
 *   - ARCHITECTURE.md §4 (server.js responsibilities)
 */

const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/database');

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection before binding port
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma ORM.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🔒 Database connection closed. Server shut down.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
