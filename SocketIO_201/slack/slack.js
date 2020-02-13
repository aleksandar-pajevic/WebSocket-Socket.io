const socketio = require('socket.io');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket)=>{
    socket.emit('messageFromServer', {data:'Hello from server!'});
    socket.on('dataToServer', (dataFromClient)=>{
        console.log(dataFromClient);
    })
    socket.on('userMessageToServer', (msg)=>{
        // console.log(msg)
        io.of('/').emit('messageToClients', {text: msg.text})
    })
})

io.of('/admin').on('connection', (socket)=>{
    console.log('someone connected to Admin namespace');
    io.of('/admin').emit('welcome', 'Admin, hello from Server!')
})
