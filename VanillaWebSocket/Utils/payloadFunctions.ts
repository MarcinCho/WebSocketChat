import { WebSocketWithUser } from "../main.ts";
import Message from "../Models/Message.ts";
import Room from "../Models/Room.ts";

export function sendMessage(
  socket: WebSocketWithUser,
  rooms: Map<string, Room>,
  message: Message
) {
  if (rooms.has(message.room_id)) {
    const room = rooms.get(message.room_id);
    if (room && room.users?.includes(message.sender)) {
      socket.send(JSON.stringify(message));
      console.log("Msg Sent from %s", room.name);
    }
  } else {
    socket.send(JSON.stringify("Room not found please create room first"));
  }
}
