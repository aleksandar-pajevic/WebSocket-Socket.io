const socketio = require('socket.io');
const express = require('express');
const app = express();

let namespaces = require('./data/namespaces');
console.log(namespaces);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

//io.on = io.of('/').on
io.on('connection', (socket) => {
	//build an array to send back with the img and endpoint for each NS
	let nsData = namespaces.map((ns) => {
		return {
			img: ns.img,
			endpoint: ns.endpoint,
		}
	})
	// console.log('nsData:', nsData)
	// send the nsData back to the client. We need to use socket, NOT io, because we want it to go to just this client.
	socket.emit('nsList', nsData);
})



// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
	io.of(namespace.endpoint).on('connection', (nsSocket) => {
		// console.log(`${nsSocket.id} has join ${namespace.endpoint}`)
		// a socket has connected to one of our chatgeoup namespaces.
		// send that ns group info back
		const username = nsSocket.handshake.query.username;
		nsSocket.emit('nsRoomLoad', namespace.rooms);
		nsSocket.on('joinRoom', (roomName, numberOfUsersCallback) => {
			//deal with history.. once we have it
			// console.log('you wanna connect to',roomName, 'room')
			const roomToLeave = Object.keys(nsSocket.rooms)[1];
			nsSocket.leave(roomToLeave);
			updateUsersInRoom(namespace, roomToLeave)
			nsSocket.join(roomName);
			// io.of(namespace.endpoint).in(roomName).clients((error, clients) => {
			// 	// console.log('connected clients:', clients.length)
			// 	numberOfUsersCallback(clients.length)
			// })
			const nsRoom = namespace.rooms.find((room) => {
				return room.roomTitle === roomName;
			})
			nsSocket.emit('historyCatchUp', nsRoom.history);
			updateUsersInRoom(namespace, roomName)
		})

		nsSocket.on('userMessageToServer', (msg) => {
			const fullMsg = {
				text: msg.text,
				time: Date.now(),
				username: username,
				avatar: 'http://via.placeholder.com/30'
			}
			console.log("full message", fullMsg)
			// Send this message to ALL the sockets that are in the room that THIS socket is in.
			// How can we found out what room this socket is in?
			console.log(nsSocket.rooms)
			//the user will be in 2nd room in the object list
			//This is because the socket ALWAYS joins its own room on connection
			//get the keys
			const roomTitle = Object.keys(nsSocket.rooms)[1];
			console.log('namespace:', namespace);
			// we need to find the Room object for this room
			const nsRoom = namespace.rooms.find((room) => {
				return room.roomTitle === roomTitle;
			})
			console.log("nsRoom", nsRoom);
			nsRoom.addMessage(fullMsg);
			io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
		})
	}) 	
})

function updateUsersInRoom(namespace, roomName){
		//here we are gonna send back the number of users in this room to ALL sockets connected to this room
		io.of(namespace.endpoint).in(roomName).clients((error, clients)=>{
			console.log(`There are ${clients.length} in the room`);
			io.of(namespace.endpoint).in(roomName).emit('updateMembers', clients.length);
		})
}