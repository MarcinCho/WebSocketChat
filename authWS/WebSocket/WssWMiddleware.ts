import { WebSocketServer } from "ws";
import { Buffer } from "node:buffer";
import { handleMessage } from "../Controllers/WSController.ts";
import Message from "../Models/Message.ts";
import { IncomingMessage } from "@oak/oak/http_server_node";
import {
  MessageMiddleware,
  MsgWAuth,
  WebSocketMiddleware,
  WsWithDetails,
} from "../Models/Types.ts";

export default class WebSocketServerWithMiddleware {
  private server: WebSocketServer;
  private middlewares: WebSocketMiddleware[] = [];
  private messageMiddlewares: MessageMiddleware[] = [];

  constructor(port: number) {
    this.server = new WebSocketServer({ port: port });
    this.setupConnection();
    console.log("WebSocket server started on %s", port);
  }

  use(middleware: WebSocketMiddleware) {
    this.middlewares.push(middleware);
  }

  useMessage(middleware: MessageMiddleware) {
    this.messageMiddlewares.push(middleware);
  }

  private setupConnection() {
    this.server.on("connection", (ws: WsWithDetails, req: any) => {
      this.processMiddlewares(ws, req, (err?: Error) => {
        if (err) {
          ws.close(1008, err.message);
          return;
        }
        this.attachWsHandlers(ws);
      });
    });
  }

  private processMessageMiddlewares(
    msg: Message,
    ws: WsWithDetails,
    finalCallback: (err?: Error) => void
  ) {
    let index = 0;

    const next = (err?: Error) => {
      if (err) {
        finalCallback(err);
      }
      if (index < this.messageMiddlewares.length) {
        const middleware = this.messageMiddlewares[index];
        index++;
        middleware(msg, ws, next);
      } else {
        finalCallback();
      }
    };
    next();
  }

  private processMiddlewares(
    ws: WsWithDetails,
    req: IncomingMessage,
    finalCallback: (err?: Error) => void
  ) {
    let index = 0;

    const next = (err?: Error) => {
      if (err) {
        finalCallback(err);
      }
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        middleware(ws, req, next);
      } else {
        finalCallback();
      }
    };
    next();
  }

  private attachWsHandlers(ws: WsWithDetails) {
    console.log(
      "WebSocket connected id: %s state %s",
      ws.id,
      ws.readyState ? "active" : "closed"
    );

    ws.on("message", (data: Buffer) => {
      const message = JSON.parse(data.toString("utf-8")) as MsgWAuth;
      this.processMessageMiddlewares(message, ws, (err?: Error) => {
        if (err) {
          ws.close(1008, err.message);
          return;
        }
      });
      handleMessage(message, this.server, ws);
    });
  }
}
