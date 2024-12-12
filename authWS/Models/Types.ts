import { IncomingMessage } from "@oak/oak/http_server_node";
import ConnectionDetails from "./ConnectionDetails.ts";
import { WebSocket as WS } from "ws";
import Message from "./Message.ts";

export type WsWithDetails = WS & ConnectionDetails;

export type WebSocketMiddleware = (
  ws: WsWithDetails,
  req: IncomingMessage,
  next: (err?: Error) => void
) => void;

export type MessageMiddleware = (
  message: Message,
  ws: WsWithDetails,
  next: (err?: Error) => void
) => void;

export type MsgWAuth = {
  room_id: string;
  msg_type: string;
  user_id: string;
  payload: string;
  timestamp: string;
  token: string;
};
