/* eslint-disable*/
const chatForm = document.getElementById('chat-form');
const chatScroll = document.querySelector('.chat-messages');
const roomname = document.getElementById('room-name');
const userlist = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();
socket.emit('joinRoom', { username, room });
socket.on('roomUser', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  chatScroll.scrollTop = chatScroll.scrollHeight;
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  //   console.log(msg);
  socket.emit('chatMessage', msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector('.chat-messages').append(div);
}
function outputRoomName(room) {
  roomname.innerText = room;
}
function outputUsers(users) {
  userlist.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
