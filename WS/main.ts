import { WebSocket, WebSocketServer } from "ws";
import Message from "./Models/Message.ts";
import MsgTypes from "./Models/MsgTypes.ts";
import Room from "./Models/Room.ts";

const wss = new WebSocketServer({ port: 3001 });
const rooms = new Map<string, Room>();

rooms.set("1", new Room("1", "Room 1", ["te", "ta", "to"]));

wss.on("connection", (ws: WebSocket) => {
  ws.id = crypto.randomUUID();
  ws.user = "Can I actualy do it?";
  console.log(ws.id);

  ws.on("open", () => {
    console.log("WebSocket client connected");
    console.log("Socket ID: " + ws.connection_id);
  });

  ws.on("message", (e: { toString: (arg0: string) => string }) => {
    const msgAsString = e.toString("utf-8");
    const msg = JSON.parse(msgAsString) as Message;
    console.log(msg);

    switch (msg.msg_type) {
      case MsgTypes.AUTH:
        // if (true) {
        //   // if token is valid authorized to true or authorize socet client
        //   // socket.authorized = true;
        //   console.log("Socket authorized");
        // }
        break;
      case MsgTypes.MESSAGE:
        if (rooms.has(msg.room_id)) {
          // here we somehow have to send msg to all users in room
          console.log("We Should be here sending msg");
          console.log(msg);
          const room = rooms.get(msg.room_id);
          if (room && room.users?.includes(msg.sender)) {
            wss.clients.foreach((client: WebSocket) => {
              if (room.users?.includes(client.id)) {
                client.send(JSON.stringify(msg));
              }
            });
          } else {
            wss.clients.foreach((client: WebSocket) => {
              client.send(JSON.stringify(msg));
            });
          }
          break;
        }
        break;
      case MsgTypes.CREATE:
        if (!ws.authorized) {
          rooms.set(msg.room_id, new Room(msg.room_id, msg.payload));
          console.log(rooms);
        }
        break;
      case MsgTypes.JOIN:
        break;
      case MsgTypes.LEAVE:
        break;
      default:
        console.error("Unknown message type: " + msg.msg_type);
    }
  });
});
