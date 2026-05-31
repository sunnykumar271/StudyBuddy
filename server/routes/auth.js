const express = require('express');
const router = express.Router();
const { signup, login, getMe, forgotPassword, verifyOTP,resetpassword, signupValidation,loginValidation } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

router.post('/signup', validate(signupValidation), signup);
router.post('/login', validate(loginValidation), login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetpassword);

// Protected route (requires valid JWT)
router.get('/me', protect, getMe);

module.exports = router;
