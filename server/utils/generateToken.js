// utils/generateToken.js
// ─────────────────────────────────────────────
// JWT (JSON Web Token) is a compact, self-contained token
// that proves a user's identity without hitting the database
// on every request.
//
// Structure: header.payload.signature
// Example:   eyJhbGci...  .eyJpZCI6...  .SflKxwR...
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a given user ID.
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // payload: what we store inside the token
    process.env.JWT_SECRET,      // secret key used to sign (and later verify)
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // token validity
  );
};

module.exports = generateToken;
