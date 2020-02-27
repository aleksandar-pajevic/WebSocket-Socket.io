function joinNs(endpoint) {

nsSocket = io(`http://localhost:9000${endpoint}`);
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
      //here we can join 
      let roomName = room.innerText;
      joinRoom(roomName)
    })
  })
})


}