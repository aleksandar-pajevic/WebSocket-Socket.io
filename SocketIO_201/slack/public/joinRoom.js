function joinRoom(roomName) {

  nsSocket.emit('joinRoom', roomName);
  
  nsSocket.on('historyCatchUp', (history) => {
    // console.log('history:', history)
    const messagesUl = document.querySelector('#messages');
    messagesUl.innerHTML = '';
    history.forEach((msg) => {
      newMessage = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMessage;
    })
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  })
  
  nsSocket.on('updateMembers', (numberOfUsers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${numberOfUsers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector('.curr-room-text').innerText = `${roomName}`;
  })
}