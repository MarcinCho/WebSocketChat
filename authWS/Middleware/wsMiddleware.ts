import { IncomingMessage } from "node:http";
import { WsWithDetails, MsgWAuth } from "../Models/Types.ts";
import { authorize } from "../AuthUtils/authorize.ts";

export const testLoger = (
  ws: WsWithDetails,
  req: IncomingMessage,
  next: (err?: Error) => void
) => {
  ws.started_at = new Date().toISOString();
  ws.authorized = undefined;
  ws.id = crypto.randomUUID();
  console.log("test logger: just to confirm we hit the middleware", req.read);
  next();
};

export const authSocket = async (
  ws: WsWithDetails,
  req: IncomingMessage,
  next: (err?: Error) => void
) => {
  if (
    req.headers &&
    req.headers["Authorization"] &&
    req.headers["Authorization"][0]
  ) {
    const token = req.headers["Authorization"][0].split(" ")[1];
    if (token) {
      const iss = await authorize(token);
      if (iss) {
        console.log("authSocket: authenticated");
        ws.authorized = iss;
        next();
      } else {
        console.log("Auth Socket empty header or no payload");
      }
    }
  } else {
    console.log("Headers not set");
    ws.close(1008, "No token");
  }
};

export const testMsgMiddleware = (
  msg: MsgWAuth,
  ws: WsWithDetails,
  next: (err?: Error) => void
) => {
  console.log(msg);
  console.log("test message middleware");
  next();
};

export const authSocketWithMsg = async (
  msg: MsgWAuth,
  ws: WsWithDetails,
  next: (err?: Error) => void
) => {
  console.log("inside auth auth msg");

  if (ws.authorized) {
    console.log("Is authorized ?????");
    next();
  } else if (msg.msg_type === "AUTH") {
    const token = msg.token;
    const iss = await authorize(token);
    console.log(iss);

    if (iss) {
      ws.authorized = iss;
      console.log("Authorizing with msg works");

      next();
    } else {
      console.log("IN AUTH Auth Socket empty header or no payload");
      ws.close(1008, "No token");
    }
  } else {
    ws.close(1008, "No token");
  }
};
