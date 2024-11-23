export default class Payload {
  id: string;
  room_id: string;
  msg_type: string;
  sender: string;
  receiver: string;
  payloadMsg: string;
  timestamp: string;

  constructor(arg: Payload) {
    this.id = arg.id;
    this.room_id = arg.room_id;
    this.sender = arg.sender;
    this.msg_type = "message";
    this.receiver = arg.receiver;
    this.payloadMsg = arg.payloadMsg;
    this.timestamp = new Date().toISOString();
  }
}
