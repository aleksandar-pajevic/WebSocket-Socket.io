const socket = io('http://localhost:9000') //the / namespace-endpoint

socket.on('nsList', (nsData)=>{
  console.log('the list of namespaces has arrived!!')
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = " ";
  nsData.forEach( (ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`
  });
  // add a click listener for each namespace
  Array.from(document.getElementsByClassName('namespace')).forEach((element)=>{
    element.addEventListener('click', (e)=>{
      const nsEndpoint = element.getAttribute('ns');
      console.log(`I should now go to ${nsEndpoint}`)
    })
  })

  const nsSocket = io('http://localhost:9000/wiki');
  nsSocket.on('nsRoomLoad', (data)=>{
    console.log('these are the rooms in selected namespace:', data)

    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = "";
    data.forEach((room)=>{    
      let glpyh;
      glpyh = room.privateRoom ? 'lock' : 'globe'  ;
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`
    })
    // add click listener to each room
    let roomNodes = document.getElementsByClassName('room');
    Array.from(roomNodes).forEach(room =>{
      room.addEventListener('click', (e)=>{
        console.log('you clicked on', room.innerText, 'room')
      })
    });
  })
})


socket.on('messageFromServer', (dataFromServer) => {
  console.log(dataFromServer);
});


document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('form submited');
  let newMessage = document.querySelector('#user-message').value;
  // console.log(userMessage)
  socket.emit('userMessageToServer', {
    text: newMessage
  });
});
