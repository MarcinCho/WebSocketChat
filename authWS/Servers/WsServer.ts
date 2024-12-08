import { WebSocket, WebSocketServer } from "ws";
import Message from "../Models/Message.ts";
import { Buffer } from "node:buffer";
import ConnectionDetails from "../Models/ConnectionDetails.ts";
import { handleMessage } from "../Controllers/ChatController.ts";

type WsWithDetails = WebSocket & ConnectionDetails;

export const WsServer = (port: number) => {
  const wss = new WebSocketServer({ port: port });
  console.log("WebSocket server started on %s", port);

  wss.on("connection", (ws: WsWithDetails) => {
    ws.started_at = new Date().toISOString();
    ws.authorized = false;
    ws.id = crypto.randomUUID();
    console.log(
      "WebSocket connected id: %s state %s",
      ws.id,
      ws.readyState ? "active" : "closed"
    );

    ws.on("message", (data: Buffer) => {
      const message = JSON.parse(data.toString("utf-8")) as Message;

      handleMessage(message, wss, ws);
    });
  });
};
