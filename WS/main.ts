import { WebSocket, WebSocketServer } from "ws";
import { Buffer } from "node:buffer";
import Message from "./Models/Message.ts";
import { handleMessage } from "./ChatFunctions.ts";
import { connectToDB } from "./Repository/PersistenceFunctions.ts";

const wss = new WebSocketServer({ port: 3001 });

export const db = connectToDB();

wss.on("connection", (ws: WebSocket) => {
  ws.id = crypto.randomUUID();
  ws.usenrname = "test";
  console.log(ws.id);
  console.log(
    "WebSocket connected id: %s state %s",
    ws.id,
    ws.readyState ? "active" : "closed"
  );

  ws.on("message", (data: Buffer) => {
    // Buffer is getting send between sockets
    const message = JSON.parse(data.toString("utf-8")) as Message;
    // console.log(message); // TESTING

    handleMessage(message, wss);

    wss.clients.forEach(function each(client: WebSocket) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
