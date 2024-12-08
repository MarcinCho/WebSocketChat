import { Collection, Document } from "mongodb";
import Message from "../Models/Message.ts";
import MsgTypes from "../Models/MsgTypes.ts";
import { WebSocket, WebSocketServer } from "ws";
import Room from "../Models/Room.ts";
import db from "../Database/dbConnection.ts";

export async function handleMessage(
  message: Message,
  wss: WebSocketServer,
  ws: WebSocket
) {
  //Authentication switch something more than simple flag in msg

  const db_conn = await db;
  const db_rooms = db_conn.collection("rooms");
  const db_messages = db_conn.collection("messages");

  switch (message.msg_type) {
    case MsgTypes.AUTH:
      handleAUTH(message, ws);
      break;
    case MsgTypes.MESSAGE:
      handleMSG(message, wss, ws, db_rooms, db_messages);
      break;
    case MsgTypes.CREATE:
      handleCREATE(message, db_rooms);
      break;
    case MsgTypes.JOIN:
      handleJOIN(message, db_rooms);
      break;
    case MsgTypes.LEAVE:
      handleLEAVE(message, db_rooms);
      break;
    default:
      console.error("Unknown message type: " + message.msg_type);
  }
}

async function handleMSG(
  message: Message,
  wss: WebSocketServer,
  ws: WebSocket,
  db_rooms: Collection<Document>,
  db_messages: Collection<Document>
) {
  const room = await db_rooms.findOne({
    id: message.room_id,
  });
  if (room) {
    if (room.users.includes(message.user_id)) {
      wss.clients.forEach(function each(client: WebSocket) {
        if (
          client.readyState === WebSocket.OPEN &&
          room.users.includes(client.username) &&
          client !== ws
        ) {
          console.log("Message sent to room");
          client.send(JSON.stringify(message));
        }
      });
      db_messages.insertOne(message);
      console.log("Message sent to room");
    }
  } else {
    console.log("Message not sent to room");
  }
}

async function handleCREATE(msg: Message, db_rooms: Collection<Document>) {
  const room = await db_rooms.findOne({
    id: msg.room_id,
  });
  if (!room) {
    const new_room = new Room(msg.room_id, msg.user_id, msg.payload, [
      msg.user_id,
    ]);
    await db_rooms.insertOne(new_room);
    console.log("Room created");
  } else {
    console.log("room already exists");
    return "Room already exists";
  }
  console.log(msg);
}
async function handleJOIN(msg: Message, db_rooms: Collection<Document>) {
  const room = await db_rooms.findOne({ id: msg.room_id });
  if (!room) {
    return "Room does not exist";
  } else {
    if (room.users.includes(msg.user_id)) {
      return "User already in room";
    } else {
      room.users.push(msg.user_id);

      await db_rooms.updateOne(
        {
          id: msg.room_id,
        },
        {
          $set: {
            users: room.users,
          },
        }
      );
      console.log("User joined room");
      return "User joined room";
    }
  }
}

async function handleLEAVE(msg: Message, db_rooms: Collection<Document>) {
  const room = await db_rooms.findOne({ id: msg.room_id });
  if (!room) {
    return "Room does not exist";
  } else {
    if (room.users.includes(msg.user_id)) {
      room.users = room.users.filter((user: string) => user !== msg.user_id);
      console.log(room.users);
      await db_rooms.updateOne(
        {
          id: msg.room_id,
        },
        {
          $set: {
            users: room.users,
          },
        }
      );
      console.log("User removed from room");
    } else {
      console.log("User not removed from room");
    }
  }
}

function handleAUTH(msg: Message, ws: WebSocket) {
  ws.username = msg.user_id;
  console.log("User %s authenticated", ws.username);
}
