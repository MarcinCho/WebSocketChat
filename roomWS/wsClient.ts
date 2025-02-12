import Message from "./Models/Message.ts";
import WebSocket from "ws";

export async function collectInput(prompt: string): Promise<string> {
  console.log(prompt);

  const buffer = new Uint8Array(2048);
  const field = await Deno.stdin.read(buffer);

  return field ? new TextDecoder().decode(buffer.slice(0, field)) : "";
}

let exit = "";
const ws = new WebSocket("ws://localhost:3001");

const mode = (
  await collectInput("Would you like to send or receive? (send/receive): ")
).trim();

const username = await authMSG(ws);

while (!exit.includes("exit")) {
  let messageToSend: Message;
  if (mode === "send") {
    const room_id = (await collectInput("Room ID: ")).trim();
    const sender = username;
    const msg_type = (await collectInput("Msg Type: ")).trim();
    const payload = (await collectInput("Message: ")).trim();
    const timestamp = new Date().toISOString();

    messageToSend = {
      room_id, // here just add room number and thats it
      sender,
      msg_type,
      payload,
      timestamp,
    };

    ws.send(JSON.stringify(messageToSend));
  }
  ws.on("message", (data: string) => {
    const msg = JSON.parse(data) as Message;
    console.log(msg);
  });

  ws.onopen = () => {
    console.log("WebSocket connected");
  };
  ws.onerror = () => {
    console.log("WebSocket error");
  };

  ws.onclose = () => {
    console.log("WebSocket closed");
  };

  exit = await collectInput("Would you like to exit? (exit): ");
}

Deno.exit(0);

async function authMSG(ws: WebSocket) {
  const username = (await collectInput("Whats your username?: ")).trim();
  let messageToSend: Message;

  const room_id = "";
  const sender = username;
  const msg_type = "AUTH";
  const payload = username;
  const timestamp = new Date().toISOString();

  messageToSend = {
    room_id, // here just add room number and thats it
    sender,
    msg_type,
    payload,
    timestamp,
  };

  ws.send(JSON.stringify(messageToSend));
  return username;
}
