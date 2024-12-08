import { WsServer } from "./Servers/WsServer.ts";
import { RestServer } from "./Servers/RestServer.ts";

const RestPort = 3002;
const WsPort = 3001;

RestServer(RestPort);
WsServer(WsPort);
