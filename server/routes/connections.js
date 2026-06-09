const express = require('express');
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getMyConnections,
  getPendingRequests,
  getConnectionStatus
} = require('../controllers/connectionController');
const { protect } = require('../middlewares/auth');

router.post('/request', protect, sendRequest);
router.post('/accept', protect, acceptRequest);
router.post('/reject', protect, rejectRequest);
router.get('/', protect, getMyConnections);
router.get('/pending', protect, getPendingRequests);
router.get('/status/:targetUserId', protect, getConnectionStatus);
module.exports = router;
