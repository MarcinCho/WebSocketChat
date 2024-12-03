import { connectToDB } from "./Repository/PersistenceFunctions.ts";
import Room from "./Models/Room.ts";

export async function createRoom() {
  const db = await connectToDB();
  const db_rooms = db.collection("rooms");

  const room: Room = new Room("1", "name", ["test", "wwwww", "ttttt"]);

  db_rooms.insertOne(room);
}
