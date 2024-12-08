export default interface Message {
  room_id: string;
  msg_type: string;
  user_id: string;
  payload: string;
  timestamp: string;
}
