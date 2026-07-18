/**
 * Environment Configuration
 * 
 * Loads and validates all required environment variables.
 * Fails fast on missing critical variables in production.
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
require('dotenv').config();

const env = {
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRY_DAYS, 10) || 7,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Frontend URL (for password reset links)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Password Reset
  PASSWORD_RESET_TOKEN_EXPIRY_MINUTES: parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES, 10) || 15,

  // Mail
  MAIL_HOST: process.env.MAIL_HOST || '',
  MAIL_PORT: parseInt(process.env.MAIL_PORT, 10) || 587,
  MAIL_USER: process.env.MAIL_USER || '',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
  MAIL_FROM: process.env.MAIL_FROM || 'RBAC Starter <noreply@example.com>',

  // Google OAuth & reCAPTCHA
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',

  // Helpers
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
};

// Validate critical variables in production
if (env.isProduction) {
  const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = env;
