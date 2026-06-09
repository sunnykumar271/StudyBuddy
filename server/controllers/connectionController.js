 // controllers/connectionController.js
const Connection = require('../models/Connection');
const User = require('../models/User');

// @desc  Send connection request
// @route POST /api/connections/request
// @access Private
const sendRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.body;

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });

    const existingConnection = await Connection.findOne({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const connection = await Connection.create({
      sender: req.user._id,
      receiver: receiverId,
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

// @desc  Accept connection request
// @route POST /api/connections/accept
// @access Private
const acceptRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: 'Connection not found' });

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    // Add to each other's connections array
    await User.findByIdAndUpdate(connection.sender, { $addToSet: { connections: connection.receiver } });
    await User.findByIdAndUpdate(connection.receiver, { $addToSet: { connections: connection.sender } });

    res.json({ message: 'Connection accepted', connection });
  } catch (error) {
    next(error);
  }
};

// @desc  Reject connection request
// @route POST /api/connections/reject
// @access Private
const rejectRequest = async (req, res, next) => {
  try {
    const { connectionId } = req.body;

    const connection = await Connection.findById(connectionId);
    if (!connection) return res.status(404).json({ message: 'Connection not found' });

    if (connection.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({ message: 'Connection rejected' });
  } catch (error) {
    next(error);
  }
};

// @desc  Get my connections (accepted)
// @route GET /api/connections
// @access Private
const getMyConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'accepted',
    })
      .populate('sender', 'name department skills interests')
      .populate('receiver', 'name department skills interests');

    res.json(connections);
  } catch (error) {
    next(error);
  }
};

// @desc  Get pending incoming requests
// @route GET /api/connections/pending
// @access Private
const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await Connection.find({
      receiver: req.user._id,
      status: 'pending',
    }).populate('sender', 'name department skills interests');

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// @desc  Get connection status with a specific user
// @route GET /api/connections/status/:targetUserId
// @access Private
const getConnectionStatus = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { sender: req.user._id, receiver: targetUserId },
        { sender: targetUserId, receiver: req.user._id },
      ],
    });

    if (!connection) {
      return res.json({ status: null, connectionId: null });
    }

    res.json({
      status: connection.status,
      connectionId: connection._id,
      isSender: connection.sender.toString() === req.user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { sendRequest, acceptRequest, rejectRequest, getMyConnections, getPendingRequests, getConnectionStatus };
