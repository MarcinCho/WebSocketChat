// @deno-types="@types/ws"
import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3001 });

export default class Message {
  id: string;
  room_id: string;
  msg_type: string;
  sender: string;
  receiver: string;
  payload: string;
  timestamp: string;

  constructor(arg: Message) {
    this.id = arg.id;
    this.room_id = arg.room_id;
    this.sender = arg.sender;
    this.msg_type = "message";
    this.receiver = arg.receiver;
    this.payload = arg.payload;
    this.timestamp = new Date().toISOString();
  }
}

wss.on("connection", (ws: WebSocket) => {
  ws.id = crypto.randomUUID();
  console.log(
    "WebSocket connected id: %s state %s",
    ws.id,
    ws.readyState ? "active" : "closed"
  );

  ws.on("message", (data: string) => {
    const message = JSON.parse(data) as Message;
    console.log(message);

    // parsing logic here
    wss.clients.forEach(function each(client: WebSocket) {
      if (client.readyState === WebSocket.OPEN) {
        console.log("sending to" + client.id);

        client.send(data); // or JSON.stringify(message)
      }
    });
  });
});
