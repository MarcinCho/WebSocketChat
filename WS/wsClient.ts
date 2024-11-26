import Message from "./Models/Message.ts";
import WebSocket from "ws";

export async function collectInput(prompt: string): Promise<string> {
  console.log(prompt);

  const buffer = new Uint8Array(2048);
  const field = await Deno.stdin.read(buffer);

  return field ? new TextDecoder().decode(buffer.slice(0, field)) : "";
}

if (import.meta.main) {
  let exit = "";
  const ws = new WebSocket("ws://localhost:3001");

  const mode = (
    await collectInput("Would you like to send or receive? (send/receive): ")
  ).trim();

  if (mode === "send") {
    while (!exit.includes("exit")) {
      const room_id = (await collectInput("Room ID: ")).trim();
      const sender = (await collectInput("Sender: ")).trim();
      const msg_type = (await collectInput("Msg Type: ")).trim();
      const receiver = "test";
      const payload = (await collectInput("Message: ")).trim();
      const timestamp = new Date().toISOString();

      const messageToSend: Message = {
        id: "",
        room_id, // here just add room number and thats it
        sender,
        msg_type,
        receiver,
        payload,
        timestamp,
      };

      ws.onopen = () => {
        console.log("WebSocket connected");
      };
      ws.on("error", (e: any) => {
        console.log(e);
      });

      ws.on("message", (data: string) => {
        const msg = JSON.parse(data) as Message;
        console.log(msg);
      });

      ws.on("close", (e: any) => {
        console.log(e);
      });

      ws.send(JSON.stringify(messageToSend));

      exit = await collectInput("Would you like to exit? (exit): ");
    }
  } else {
    while (!exit.includes("exit")) {
      ws.on("open", () => {
        console.log("WebSocket connected");
      });
      ws.on("error", (e: any) => {
        console.log(e);
      });

      ws.on("message", (data: string) => {
        const msg = JSON.parse(data) as Message;
        console.log(msg);
      });

      // Important note take a look how is it sending XD

      ws.on("close", (e: any) => {
        console.log(e);
      });
      exit = await collectInput("Would you like to exit? (exit): ");
    }
  }

  Deno.exit(0);
}
