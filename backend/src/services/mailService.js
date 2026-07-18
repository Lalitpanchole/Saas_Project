/**
 * Mail Service
 * 
 * Sends transactional emails using Nodemailer.
 * Falls back to console logging in development if SMTP is not configured.
 * 
 * References:
 *   - ARCHITECTURE.md §20 (Forgot password architecture)
 *   - BUSINESS_RULES.md BR-AUTH-022 (Delivery failure must not expose credentials)
 */

const nodemailer = require('nodemailer');
const env = require('../config/env');

/**
 * Create a Nodemailer transporter.
 * In development without SMTP config, uses console logging as a stub.
 */
function createTransporter() {
  if (env.MAIL_HOST && env.MAIL_USER) {
    return nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_PORT === 465,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD,
      },
    });
  }

  // Development stub — log to console
  return null;
}

const transporter = createTransporter();

/**
 * Send a password reset email.
 * 
 * @param {string} toEmail
 * @param {string} firstName
 * @param {string} resetUrl
 */
async function sendPasswordResetEmail(toEmail, firstName, resetUrl) {
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #0d6efd; color: white; padding: 12px 30px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        This link will expire in ${env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES} minutes.
      </p>
      <p style="color: #666; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="color: #999; font-size: 12px;">
        This email was sent by ${env.MAIL_FROM ? env.MAIL_FROM.split('<')[0].trim() : 'RBAC Starter'}.
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.MAIL_FROM,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[Mail] Password reset email sent to ${toEmail}`);
    } catch (err) {
      // BR-AUTH-022: Never expose email failure details to the API response
      console.error(`[Mail] Failed to send password reset email to ${toEmail}:`, err.message);
    }
  } else {
    // Development stub
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 [DEV] Password Reset Email (SMTP not configured)');
    console.log(`   To: ${toEmail}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Reset URL: ${resetUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  }
}

module.exports = {
  sendPasswordResetEmail,
};
