const express = require('express');
const router = express.Router();
const { getAllUsers, getMatches, getUserById, editProfile, completeOnboarding } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.get('/', protect, getAllUsers);
router.get('/matches', protect, getMatches);
router.put('/edit-profile', protect, editProfile);
router.put('/onboarding', protect, completeOnboarding);
router.get('/:id', protect, getUserById);

module.exports = router;
