import { connectToDB } from "./Repository/PersistenceFunctions.ts";
import { WsServer } from "./WsServer.ts";
import { RestServer } from "./RestServer.ts";

const RestPort = 3002;
const WsPort = 3001;

export const db = connectToDB();

RestServer(RestPort);

WsServer(WsPort);
