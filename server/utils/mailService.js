// server/utils/mailService.js
// utils/mailService.js
// ─────────────────────────────────────────────
// This module handles sending OTP emails for the
// Forgot Password flow using Nodemailer.
// ─────────────────────────────────────────────
const transporter = require("../config/email");

/**
 * Sends an OTP email to the user.
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The 6-digit OTP to send
 * @param {string} userName - User's name for personalization
 */

const sendOTPEmail = async (toEmail, otp, userName) => {
  const mailOptions = {
    from: `"StudyBuddy" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your StudyBuddy Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #4F46E5;">StudyBuddy 📚</h2>
        <p style="font-size: 16px; color: #374151;">Hello, ${userName}!</p>
        <p style="font-size: 16px; color: #374151;">You requested a password reset. Use the OTP below:</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #4F46E5;">${otp}</span>
        </div>
            <div style="text-align: center; margin: 30px 0;">
            <span style="
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              color: #6366f1;
              background: #f0f0ff;
              padding: 15px 25px;
              border-radius: 8px;
              display: inline-block;
            ">${otp}</span>
          </div>

        <p style="color: #6B7280; font-size: 14px;">⏰ This OTP expires in <strong>10 minutes</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9CA3AF; font-size: 12px;">— The StudyBuddy Team</p>
      </div>
    `,
  };

  // sendMail returns info about the sent email
  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to ${toEmail}: ${info.messageId}`);
  return info;
};

module.exports = {sendOTPEmail};