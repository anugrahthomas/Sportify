import { WebSocketServer } from "ws";

// configuring websocket server to port-8080
const wss = new WebSocketServer({ port: 8080 });

// Websocket connection event
// (single client = socket, request contain headers, socket information)
wss.on("connection", (socket, request) => {
  const ip = request.socket.remoteAddress;
  console.log(`Client Connected: ${ip}`);
  
  // socket sent data (message event)
  socket.on("message", (rawData) => {
    // broadcast to all
    const message = rawData.toString();
    wss.clients.forEach((client) => {
      if (client.readyState === 1)
        client.send(`Broadcasting Message: ${message}`);
    });
  });

  // error handling
  socket.on("error", (err) => {
    console.error(`Error: ${err.message}, ${ip}`);
  });

  // closing socket connection
  socket.on("close", () => {
    console.log(`Client Disconneted: ${ip}`);
  });
});

console.log("Websocket Server running on PORT=8080");
