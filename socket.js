const socketIO = require('socket.io');
const User = require('./model/user');
const Message = require('./model/message');

function socketSetup(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a room
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      console.log(`${username} joined room: ${room}`);
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      const { sender, content, room } = data;

      // Save message to the database
      const newMessage = new Message({ sender, content, room });
      await newMessage.save();

      // Broadcast message to the room
      io.to(room).emit('receiveMessage', newMessage);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = socketSetup;
