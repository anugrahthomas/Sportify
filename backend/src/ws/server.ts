import { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";

const sendJson = (socket: WebSocket, payload: { message: string }) => {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
};

const broadcast = (wss: WebSocketServer, payload: JSON) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(payload));
  });
};

export const attackWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024 * 5,
  }); // 5mb max
  wss.on("connection", (socket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });
    sendJson(socket, { message: "hello" });

    socket.on("error", console.error);
  });

  const timer = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(timer));

  function broadcastMatch(match: any) {
    broadcast(wss, match);
  }

  return { broadcastMatch };
};
