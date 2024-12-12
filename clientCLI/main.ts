interface Message {
  room_id: string;
  msg_type: string;
  user_id: string;
  payload: string;
  timestamp: string;
  token: string;
}

async function collectInput(prompt: string): Promise<string> {
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
    const user_id = username;
    const msg_type = (await collectInput("Msg Type: ")).trim();
    const payload = (await collectInput("Message: ")).trim();
    const timestamp = new Date().toISOString();

    messageToSend = {
      room_id, // here just add room number and thats it
      user_id,
      msg_type,
      payload,
      timestamp,
      token: "",
    };

    ws.send(JSON.stringify(messageToSend));
  }

  ws.onmessage = (event: MessageEvent<string>) => {
    const msg = JSON.parse(event.data) as Message;
    console.log(msg);
  };

  ws.onopen = (_e: Event) => {
    console.log("WebSocket connected");
  };
  ws.onerror = (_e: Event | ErrorEvent) => {
    console.log("WebSocket error");
  };

  ws.onclose = (_e: CloseEvent) => {
    console.log("WebSocket closed ");
  };

  exit = await collectInput("Would you like to exit? (exit): ");
}

Deno.exit(0);

async function authMSG(ws: WebSocket) {
  const username = (await collectInput("Whats your username?: ")).trim();

  const messageToSend: Message = {
    room_id: "",
    user_id: username,
    msg_type: "AUTH",
    payload: username,
    timestamp: new Date().toISOString(),
    token:
      "v4.local.XmqOPLWit9-3-GYl99Btkp1CMdMVK3wr5p-wVZXfKD1kRbASgQRH0NWLPGXJOoKZecI12-sMnr2PSvl_G8mMgu5WWgORToY1ziQlnzezO0C675sXckeJOmjstAZI94jM96rsdy3KvBl68oiuwp8AuT2SD4JTyuK0bJwudDaZug4XZmk_guZHPUGdMoHyYZ6sqbU_fDQKBokZkImCWsGs3FPHyENVKuudFiv-AJjSK-_cmOcL3R_EBfB6PfgpQg",
  };

  ws.send(JSON.stringify(messageToSend));
  return username;
}
