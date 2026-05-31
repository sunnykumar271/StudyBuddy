// utils/generateOTP.js
// ─────────────────────────────────────────────
// Generates a 6-digit OTP (One-Time Password) for
// the Forgot Password flow.
// ─────────────────────────────────────────────

/**
 * Generates a random 6-digit OTP string.
 * Math.random() gives 0.0–1.0
 * Multiplying by 900000 and adding 100000 gives 100000–999999
 * @returns {string} - 6-digit OTP as string
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOTP;
