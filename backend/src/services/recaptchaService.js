/**
 * reCAPTCHA Verification Service
 * 
 * Verifies Google reCAPTCHA v2 / v3 token with Google siteverify servers.
 * If RECAPTCHA_SECRET_KEY is not set in .env, bypasses check to allow local development.
 */
const env = require('../config/env');

async function verifyRecaptcha(token) {
  // If no secret key is set in .env, bypass verification so local dev works
  if (!env.RECAPTCHA_SECRET_KEY) {
    return { success: true, bypassed: true };
  }

  if (!token) {
    return { success: false, message: 'reCAPTCHA token is required.' };
  }

  try {
    const params = new URLSearchParams({
      secret: env.RECAPTCHA_SECRET_KEY,
      response: token,
    });
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: 'reCAPTCHA verification failed. Please check the CAPTCHA box again.' };
    }
    return { success: true, data };
  } catch (err) {
    console.error('reCAPTCHA verification error:', err.message);
    return { success: false, message: 'Could not verify reCAPTCHA with Google servers.' };
  }
}

module.exports = { verifyRecaptcha };
