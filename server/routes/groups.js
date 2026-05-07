const express = require('express');
const router = express.Router();
const { createGroup, getAllGroups, getGroupById, joinGroup, getMyGroups } = require('../controllers/groupController');
const { protect } = require('../middlewares/auth');

router.post('/create', protect, createGroup);
router.get('/mine', protect, getMyGroups);
router.get('/', protect, getAllGroups);
router.get('/:id', protect, getGroupById);
router.post('/:id/join', protect, joinGroup);

module.exports = router;
