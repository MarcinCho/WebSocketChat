import Message from "./main.ts";
// @deno-types="@types/ws"
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

while (!exit.includes("exit")) {
  let messageToSend: Message;
  if (mode === "send") {
    const room_id = (await collectInput("Room ID: ")).trim();
    const sender = (await collectInput("Sender: ")).trim();
    const msg_type = (await collectInput("Msg Type: ")).trim();
    const receiver = "test";
    const payload = (await collectInput("Message: ")).trim();
    const timestamp = new Date().toISOString();

    messageToSend = {
      id: "",
      room_id, // here just add room number and thats it
      sender,
      msg_type,
      receiver,
      payload,
      timestamp,
    };

    ws.send(JSON.stringify(messageToSend));
  }
  exit = await collectInput("Would you like to exit? (exit): ");
}

Deno.exit(0);
