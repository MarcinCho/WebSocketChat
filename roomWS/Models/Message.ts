export default class Message {
  room_id: string;
  msg_type: string;
  sender: string;
  payload: string;
  timestamp: string;

  constructor(arg: Message) {
    this.room_id = arg.room_id;
    this.sender = arg.sender;
    this.msg_type = "message";
    this.payload = arg.payload;
    this.timestamp = new Date().toISOString();
  }
}
