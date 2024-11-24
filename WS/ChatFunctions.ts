import Message from "./Models/Message.ts";
import Room from "./Models/Room.ts";
import { WebSocket } from "ws";

export function sendToRoom(
  message: Message,
  rooms: Map<string, Room>,
  ws: WebSocket
) {
  if (rooms.has(message.room_id)) {
    const room = rooms.get(message.room_id);
    if (room && room.users?.includes(message.sender)) {
      ws.send(JSON.stringify(message));
      console.log("Msg Sent from %s", room.name);
    }
  } else {
    ws.send(JSON.stringify("Room not found please create room first"));
  }
}
