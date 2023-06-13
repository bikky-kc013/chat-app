const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

document.getElementById('leave-btn').addEventListener('click', function() {
  window.location.href = 'index.html'; 
});
// Get username and room from URL
const { username} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username});

// Get room and users
socket.on('roomUsers', ({ users }) => {
  outputUsersName(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;
  // Emit message to server
  socket.emit('chatMessage', msg);
  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

  console.log(msg);
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                   <p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
}

//add users to DOM
function outputUsersName(users){
  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}`;
}