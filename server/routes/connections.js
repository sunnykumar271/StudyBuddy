const express = require('express');
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getMyConnections,
  getPendingRequests,
} = require('../controllers/connectionController');
const { protect } = require('../middlewares/auth');

router.post('/request', protect, sendRequest);
router.post('/accept', protect, acceptRequest);
router.post('/reject', protect, rejectRequest);
router.get('/', protect, getMyConnections);
router.get('/pending', protect, getPendingRequests);

module.exports = router;
