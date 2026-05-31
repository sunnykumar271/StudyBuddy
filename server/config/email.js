// config/email.js
// ─────────────────────────────────────────────
// Configures Nodemailer transporter.
// A "transporter" is the object that knows HOW
// to send emails (via which SMTP server, with
// which credentials).
// ─────────────────────────────────────────────

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g. smtp.gmail.com
  port: process.env.EMAIL_PORT,       // 587 for TLS
  secure: false,                       // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,     // Gmail App Password (not your real password)
  },
});

module.exports = transporter;
