import { Collection, Document } from "mongodb";
import { db } from "./main.ts";
import Message from "./Models/Message.ts";
import MsgTypes from "./Models/MsgTypes.ts";
import Room from "./Models/Room.ts";
import { WebSocket, WebSocketServer } from "ws";

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

export async function handleMessage(message: Message, wss: WebSocketServer) {
  //Authentication switch something more than simple flag in msg

  const db_conn = await db;
  const db_rooms = db_conn.collection("rooms");

  switch (message.msg_type) {
    case MsgTypes.AUTH:
      break;
    case MsgTypes.MESSAGE:
      handleTypeMSG(message, wss, db_rooms);
      break;
    case MsgTypes.CREATE:
      handleTypeCREATE(message, db_rooms);
      break;
    case MsgTypes.JOIN:
      handleTypeJOIN(message);
      break;
    case MsgTypes.LEAVE:
      handleTypeLEAVE(message);
      break;
    default:
      console.error("Unknown message type: " + message.msg_type);
  }
}

async function handleTypeMSG(
  message: Message,
  wss: WebSocketServer,
  db_rooms: Collection<Document>
) {
  const room = await db_rooms.findOne({
    id: message.room_id,
  });
  // Maybe in future I will add final types for this type private open broadcats and such but not for now
  if (room) {
    console.log(room); // debuging
    if (room.users.includes(message.sender)) {
      // Checks if the user is in fact the user of the room
      wss.clients.forEach(function each(client: WebSocket) {
        if (
          client.readyState === WebSocket.OPEN &&
          room.users.includes(client.usenrname)
        ) {
          console.log("Message sent to room");
          client.send(JSON.stringify(message));
        }
      });

      return "Message sent to room";
    }
  } else {
    return "Room does not exist";
  }
}

async function handleTypeCREATE(msg: Message, db_rooms: Collection<Document>) {
  const room = await db_rooms.findOne({
    id: msg.room_id,
  });
  if (!room) {
    const new_room = new Room(msg.room_id, msg.payload, [msg.sender]);
    await db_rooms.insertOne(new_room);
    console.log("Room created");
  } else {
    return "Room already exists";
  }
  console.log(msg);
}

function handleTypeJOIN(msg: Message) {
  // here again some kind of authentication maybe pending status or something
  // if (rooms.has(msg.room_id)) {
  //   const room = rooms.get(msg.room_id);
  //   if (room) {
  //     room.users.push(msg.sender);
  //     return true;
  //   }
  // } else {
  //   return false;
  // }
  console.log(msg);
}

function handleTypeLEAVE(msg: Message) {
  // if (rooms.has(msg.room_id)) {
  // }
  console.log(msg);
}
