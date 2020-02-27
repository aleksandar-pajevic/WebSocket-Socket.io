function joinRoom(roomName){

  nsSocket.emit('joinRoom', roomName, (numberOfUsers)=>{
      document.querySelector('.curr-room-num-users').innerHTML = `${numberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
  })

  nsSocket.on('messageToClients', (msg)=>{
    document.querySelector('#messages').innerHTML += `<li> ${msg.text} </li>`;
  })
  
  document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('userMessageToServer', { text: newMessage} );
  });
  
}