export default class Message {
  id: string;
  room_id: string;
  msg_type: string;
  sender: string;
  receiver: string;
  payload: string;
  timestamp: string;

  constructor(arg: Message) {
    this.id = arg.id;
    this.room_id = arg.room_id;
    this.sender = arg.sender;
    this.msg_type = "message";
    this.receiver = arg.receiver;
    this.payload = arg.payload;
    this.timestamp = new Date().toISOString();
  }
}
