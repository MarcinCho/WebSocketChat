import {
  authSocket,
  authSocketWithMsg,
  testLoger,
  testMsgMiddleware,
} from "../Middleware/wsMiddleware.ts";
import WebSocketServerWithMiddleware from "../WebSocket/WssWMiddleware.ts";

export const WsServer = (port: number) => {
  const wss = new WebSocketServerWithMiddleware(port);

  // With vannila websockets its not possible to send headers and that stops us
  // from using that method :|
  // wss.use(authSocket);
  wss.use(testLoger);

  wss.useMessage(testMsgMiddleware);
  wss.useMessage(authSocketWithMsg);
};
