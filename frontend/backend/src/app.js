/**
 * Express Application Configuration
 * 
 * Configures global middleware, security headers, CORS, static file serving,
 * API routes, and central error handling.
 * References:
 *   - ARCHITECTURE.md §4 (Backend structure)
 *   - ARCHITECTURE.md §14 (Express pipeline)
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow serving static images across origins
}));

// CORS setup allowing credentials (for HTTP-only refresh tokens)
app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for uploaded profile images and public assets
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Mount master API router
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404 for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.path} does not exist.`,
    errors: [],
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
