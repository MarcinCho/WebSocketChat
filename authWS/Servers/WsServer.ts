import { testLoger } from "../Middleware/wsMiddleware.ts";
import WebSocketServerWithMiddleware from "../WebSocket/WssWMiddleware.ts";

export const WsServer = (port: number) => {
  const wss = new WebSocketServerWithMiddleware(port);

  wss.use(testLoger);
};
