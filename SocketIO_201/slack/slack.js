const socketio = require('socket.io');
const express = require('express');
const app = express();

let namespaces = require('./data/namespaces');
console.log(namespaces);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

//io.on = io.of('/').on
io.on('connection', (socket)=>{
    //build an array to send back with the img and endpoint for each NS
    let nsData = namespaces.map((ns)=>{
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
namespaces.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection', (nsSocket)=>{
        console.log(`${nsSocket.id} has join ${namespace.endpoint}`)
        // a socket has connected to one of our chatgeoup namespaces.
        // send that ns group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms)
    })
})