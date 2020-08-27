/* eslint-disable prettier/prettier */
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatmsg = require('./utils/formatmessage');
const {
  userJoin,
  getCurrentUser,
  usersLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot = 'Chatapp Bot';
//Static file rendering
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', (socket) => {
  //   console.log('New Connection');
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit('message', formatmsg(bot, 'Welcome Bruh'));
    socket.broadcast
      .to(user.room)
      .emit('message', formatmsg(bot, `${user.username} has joined the chat`));
    io.to(user.room).emit('roomUser', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
  socket.on('chatMessage', (msg) => {
    // console.log(msg);
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatmsg(user.username, msg));
  });
  socket.on('disconnect', () => {
    const user = usersLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatmsg(bot, `${user.username} has left the chat`)
      );
      io.to(user.room).emit('roomUser', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
// sucesss full
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Listening on server ${PORT}...`));
