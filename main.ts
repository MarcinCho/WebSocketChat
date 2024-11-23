import { collectInput } from "./client.ts";
import ConnectionDetails from "./Models/ConnectionDetails.ts";
import MsgTypes from "./Models/MsgTypes.ts";
import Payload from "./Models/Payload.ts";
import Room from "./Models/Room.ts";

type WebSocketWithUser = WebSocket & ConnectionDetails;
const testToken = "test";
const rooms: Array<Room> = [];

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
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data) as Payload;

      switch (msg.msg_type) {
        case MsgTypes.AUTH:
          if (msg.payloadMsg === testToken) {
            socket.authorized = true;
            console.log("Socket authorized");
          }
          break;
        case MsgTypes.MESSAGE:
          break;
        case MsgTypes.CREATE:
          if (!socket.authorized) {
            rooms.push(new Room(msg.room_id, msg.payloadMsg));
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
