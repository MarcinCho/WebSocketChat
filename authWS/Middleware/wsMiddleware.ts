import { IncomingMessage } from "node:http";
import { WsWithDetails } from "../Models/Types.ts";

export const testLoger = (
  ws: WsWithDetails,
  req: IncomingMessage,
  next: (err?: Error) => void
) => {
  ws.started_at = new Date().toISOString();
  ws.authorized = false;
  ws.id = crypto.randomUUID();
  console.log("test logger: just to confirm we hit the middleware", req.read);
  next();
};
