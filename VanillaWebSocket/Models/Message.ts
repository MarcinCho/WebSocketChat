import { WebSocketWithUser } from "../main.ts";
import Room from "./Room.ts";

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

  // sendMessage(socket: WebSocketWithUser, rooms: Map<string, Room>) {
  //   if (rooms.has(this.room_id)) {
  //     const room = rooms.get(this.room_id);
  //     if (room && room.users?.includes(socket.conn_user)) {
  //       socket.send(JSON.stringify(this));
  //       console.log("Msg Sent from %s", room.name);
  //     }
  //   } else {
  //     socket.send(JSON.stringify("Room not found please create room first"));
  //   }
  // }
}
