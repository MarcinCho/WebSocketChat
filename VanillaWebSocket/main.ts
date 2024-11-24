import { collectInput } from "./client.ts";
import ConnectionDetails from "./Models/ConnectionDetails.ts";
import MsgTypes from "./Models/MsgTypes.ts";
import Payload from "./Models/Message.ts";
import Room from "./Models/Room.ts";
import { sendMessage } from "./Utils/payloadFunctions.ts";
import Message from "./Models/Message.ts";

export type WebSocketWithUser = WebSocket & ConnectionDetails;
const testToken = "test";
let rooms = new Map<string, Room>();

rooms.set("1", new Room("1", "Room 1", ["te", "ta", "to"]));

Deno.serve({ port: 3001 }, (req) => {
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req) as {
      socket: WebSocketWithUser;
      response: Response;
    };
    socket.connection_id = crypto.randomUUID();
    socket.conn_user = "test";

    socket.onopen = async () => {
      console.log("WebSocket client connected");
      while (true) {
        const inppp = await collectInput(
          "Would you like to send txt to client? just type it : "
        );
        socket.send(inppp);
        console.log(socket.connection_id);
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data) as Message;
      console.log(msg);

      switch (msg.msg_type) {
        case MsgTypes.AUTH:
          if (true) {
            // if token is valid authorized to true or authorize socet client
            // socket.authorized = true;
            console.log("Socket authorized");
          }
          break;
        case MsgTypes.MESSAGE:
          if (rooms.has(msg.room_id)) {
            // here we somehow have to send msg to all users in room
            console.log("We Should be here sending msg");
            console.log(msg);

            // sendMessage(socket, rooms, msg);
            // socket.send(JSON.stringify(msg.payload));
            break;
          }
          break;
        case MsgTypes.CREATE:
          if (!socket.authorized) {
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

      if (msg.msg_type.includes("start")) {
        const username = msg.sender;
        socket.conn_user = username;
      }
      console.log("Recieved from socet: " + socket.connection_id);
    };

    socket.onclose = () => {
      console.log("Client disconnected");
      // Remove user from room
    };

    socket.onerror = () => {
      console.log("WebSocket error");
    };

    console.log("Am I able to access details here?");
    return response;
  } else {
    console.log("Not a websocket request");
    return new Response("Not a websocket request", { status: 500 });
  }
});
