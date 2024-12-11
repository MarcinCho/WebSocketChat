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
  client: WsWithDetails,
  message: Message,
  next: (err?: Error) => void
) => void;
