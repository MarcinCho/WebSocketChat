import { WebSocket, WebSocketServer } from "ws";
import { Buffer } from "node:buffer";
import Message from "./Models/Message.ts";
import Room from "./Models/Room.ts";
import { handleMessage } from "./ChatFunctions.ts";
import { connectToDB } from "./Repository/PersistenceFunctions.ts";
import { createRoom } from "./RoomFunctions.ts";

const wss = new WebSocketServer({ port: 3001 });

export const db = connectToDB();

// Those two should be moved to database

wss.on("connection", (ws: WebSocket) => {
  ws.id = crypto.randomUUID();
  ws.usenrname = "test";
  console.log(ws.id);
  console.log("WebSocket connected state " + ws.readyState);

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
