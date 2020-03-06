function joinNs(endpoint) {
  if(nsSocket){
    // Check to see if nsSocket is asctually a socket
    nsSocket.close();
    // remove the event listener before it's added again
    document.querySelector('#user-input').removeEventListener('submit', formSubmission);
  }

  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on('nsRoomLoad', (data) => {
    // console.log('these are the rooms in selected namespace:', data)

    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    data.forEach((room) => {
      let glpyh;
      glpyh = room.privateRoom ? 'lock' : 'globe';
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`
    })
    // add click listener to each room
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach(room => {
      room.addEventListener('click', (e) => {
        console.log('you clicked on', room.innerText, 'room')
        //here we can join 
        let roomName = room.innerText;
        joinRoom(roomName)
      })
    })

    nsSocket.on('messageToClients', (msg) => {
      console.log(msg);
      const newMsg = buildHTML(msg);
      document.querySelector('#messages').innerHTML += newMsg;
    })

    document.querySelector('.message-form').addEventListener('submit', formSubmission);

  })
  
  
  
}
    function formSubmission(event){
      event.preventDefault();
      let newMessage = document.querySelector('#user-message').value;
      nsSocket.emit('userMessageToServer', {
        text: newMessage
      });
      document.querySelector('#user-input').reset();
    };

    function buildHTML(msg) {
      const convertedDate = new Date(msg.time).toLocaleString();
      const newHTML = `
      <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
      </li>
      `
      return newHTML;
    }