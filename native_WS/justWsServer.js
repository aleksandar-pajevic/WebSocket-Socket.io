const http = require('http');
//3rd party module, ws!
const websocket = require('ws');

const server = http.createServer((req, res) => {
  res.end('i am connected!')
});

const wss = new websocket.Server({server})
wss.on('headers', (headers, req)=>{
console.log(headers)
});

wss.on('connection', (ws, req)=>{
  ws.send('welcome to the websocket server!!');
  ws.on('message', (msg)=>{
    console.log(msg);
  })
})

server.listen(8000);
 