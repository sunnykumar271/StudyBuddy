const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a group room
    socket.on('join-room', async ({ groupId, userId }) => {
      try {
        socket.join(groupId);
        const user = await User.findById(userId).select('name');
        if (user) {
          socket.to(groupId).emit('user-joined', {
            userName: user.name,
            userId,
            timestamp: new Date(),
          });
        }
        console.log(`👤 User ${userId} joined room ${groupId}`);
      } catch (err) {
        console.error('Error in join-room:', err.message);
      }
    });

    // Send a message
    socket.on('send-message', async ({ groupId, userId, content }) => {
      try {
        if (!content || !content.trim()) return;

        const group = await Group.findById(groupId);
        if (!group) return;

        const message = await Message.create({
          group: groupId,
          sender: userId,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id).populate(
          'sender',
          'name department'
        );

        // Broadcast to everyone in the room (including sender)
        io.to(groupId).emit('receive-message', populatedMessage);
      } catch (err) {
        console.error('Error in send-message:', err.message);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Leave a room
    socket.on('leave-room', ({ groupId }) => {
      socket.leave(groupId);
      console.log(`👤 Socket ${socket.id} left room ${groupId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
