const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const {sendOTPEmail} = require('../utils/mailService');
const { body } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// @desc  Register new user
// @route POST /api/auth/signup
// @access Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, department });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }
    // Find user — explicitly select password (it's excluded by default via `select: false`)

    const user = await User.findOne({ email }).select('+password');
     if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const ispasswordCorrect = await user.matchPassword(password);

    if (!ispasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      bio: user.bio,
      skills: user.skills,
      interests: user.interests,
      year: user.year,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    next(error);
  }
};

// @desc  Get current user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res,next) => {
  try{
        // req.user is set by the authMiddleware
        const user = await User.findById(req.user._id);

  
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
  });
  }catch(error){
    next(error);
  }
};

// ═══════════════════════════════════════════
// FORGOT PASSWORD FLOW — 3 Steps:
// Step 1: forgotPassword  → send OTP to email
// Step 2: verifyOTP       → verify OTP
// Step 3: resetPassword   → set new password
// ═══════════════════════════════════════════

// ── Step 1: Send OTP ──────────────────────
// @route   POST /api/auth/forgot-password
// @access  Public

const forgotPassword = async (req, res, next) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // Security: don't reveal if email exists or not
      return res.status(200).json({
        success: true,
        message: "If this email exists, an OTP has been sent.",
      });
    }
  

  // Generate OTP and expiry time
  const otp = generateOTP();

  // Store OTP expiry time(10 minutes from now)
  const otpExpiryinMs =
    (parseInt(process.env.OTP_EXPIRES_IN_MINUTES) || 10) * 60 * 1000;

    // Hash OTP before saving to DB for security
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + otpExpiryinMs);
    user.isOTPVerified = false; // Reset OTP verification status on new request
    await user.save({ validateBeforeSave: false }); // Skip other validations
   
    try {
    // send OTP via email
    await sendOTPEmail(user.email, otp, user.name);
  } catch (emailError) {
    //  Log the real error on server for debugging
      console.error("SMTP failed:", emailError.message);

      // clean up OTP from DB since email sending failed
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(503).json({
        success: false,
        message: "Failed to send OTP email. Please try again later.",
      });
    }
    
    res.status(200).json({
      success: true,
      message: `OTP sent to ${email} if it exists. Please check your inbox. valid for ${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes.`,
    });
} catch (error){
    next(error);
  }
};

  // ── Step 2: Verify OTP ────────────────────
// @route   POST /api/auth/verify-otp
// @access  Public

const verifyOTP = async (req, res, next) => {
   try{
    const { email, otp } = req.body;
    //Fetch user with OTP fields (excluded by default)
    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if(!user || !user.otp){
       return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP.",
      });
    }

    // Check if OTP is expired
    if(user.otpExpiry < Date.now()){
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
}

 // // Compare entered OTP with hashed OTP in database
 const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }
    // Mark OTP as verified - user can now reset password

     user.isOtpVerified = true;
    user.otp = undefined;       // clear OTP from DB after verification
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully! You can now reset your password.",
    });
  } catch (error){
    next(error);
  }
};
  // ── Step 3: Reset Password ────────────────
// @route   POST /api/auth/reset-password
// @access  Public (but gated by isOtpVerified)

const resetpassword = async(req,res,next) =>{
  try{
    const { email, newPassword} = req.body;

    const user = await User.findOne({email });

    if(!user || !user.isOtpVerified){
      return res.status(403).json({
        success: false,
        message: "Please verify your OTP before resetting your password.",
      });
    }

    // Set the new password (pre-save hook will hash it automatically)
    user.password = newPassword;
    user.isOtpVerified = false; // reset the flag
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error){
    next(error);
  }

};

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { signup, login, getMe, forgotPassword, resetpassword,verifyOTP, signupValidation, loginValidation };
