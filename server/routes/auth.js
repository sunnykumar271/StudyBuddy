const express = require('express');
const router = express.Router();
const { signup, login, getMe, forgotPassword, signupValidation, loginValidation } = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

router.post('/signup', validate(signupValidation), signup);
router.post('/login', validate(loginValidation), login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

module.exports = router;
