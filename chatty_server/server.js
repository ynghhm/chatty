const express = require('express');
const SocketServer = require('ws')

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer.Server({ server });

wss.broadcast = (receivedMessage) => {
  wss.clients.forEach((client) => {
    if (client.readyState === SocketServer.OPEN) {
      client.send(receivedMessage);
    }
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
let numberUsers = 0;

wss.on('connection', (ws) => {
  numberUsers ++
  wss.broadcast(JSON.stringify({type: "numberOfUsers", numberUsers:numberUsers}))
  // console.log(numberUsers);
  // console.log('Client connected');
  ws.on('message', (message) => {
    let receivedMessage = JSON.parse(message)
    switch(receivedMessage.type) {
      case "postMessage":
        receivedMessage.type = "incomingMessage"
        wss.broadcast(JSON.stringify(receivedMessage));
        break;
      case "postNotification":
        receivedMessage.type = "incomingNotification"
        wss.broadcast(JSON.stringify(receivedMessage));
        break;
      default:
      }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    // console.log('Client  disconnected')
    numberUsers --
  });
});
