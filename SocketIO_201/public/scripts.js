const socket = io('http://localhost:9000');
const socket2 = io('http://localhost:9000/admin');

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
});
socket.emit('dataToServer', {
  data: 'hello from Client!'
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('form submited');
  let newMessage = document.querySelector('#user-message').value;
  // console.log(userMessage)
  socket.emit('userMessageToServer', {
    text: newMessage
  });
});
socket.on('messageToClients', (msg) => {
      let d = new Date().toUTCString();
      console.log(d);
      document.querySelector('.messages').innerHTML +=
        ` <li class="message">
      <h6>${d}</h6>
      ${msg.text}
      </li>`});

      
socket2.on('messageForAdminNamespace', (data)=>{
  console.log(data)
})