const socket = io('http://localhost:9000') //the / namespace-endpoint
const socket2 = io('http://localhost:9000/admin') // the /admin namespace

socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
});

socket2.on('welcome', (data)=>{
  console.log(data);
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
