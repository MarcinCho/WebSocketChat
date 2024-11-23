import Payload from "./Models/Payload.ts";

export async function collectInput(prompt: string): Promise<string> {
  console.log(prompt);

  const buffer = new Uint8Array(2048);
  const field = await Deno.stdin.read(buffer);

  return field ? new TextDecoder().decode(buffer.slice(0, field)) : "";
}

if (import.meta.main) {
  let exit = "";
  const ws = new WebSocket("ws://localhost:3001");

  while (!exit.includes("exit")) {
    const room_id = (await collectInput("Room ID: ")).trim();
    const sender = (await collectInput("Sender: ")).trim();
    const msg_type = (await collectInput("Msg Type: ")).trim();
    const receiver = "test";
    const payloadMsg = (await collectInput("Message: ")).trim();
    const timestamp = new Date().toISOString();

    const messageToSend: Payload = {
      id: "",
      room_id, // here just add room number and thats it
      sender,
      msg_type,
      receiver,
      payloadMsg,
      timestamp,
    };

    ws.onopen = function open() {
      ws.send(JSON.stringify(messageToSend));
    };
    ws.onmessage = (e) => {
      console.log(e.data);
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.onclose = (e) => {
      console.log(e);
    };

    ws.send(JSON.stringify(messageToSend));

    exit = await collectInput("Would you like to exit? (exit): ");
  }

  Deno.exit(0);
}
