import { Context } from "@oak/oak";
import Room from "../Models/Room.ts";
import db from "../Database/dbConnection.ts";

const roomColl = db.collection<Room>("rooms");

export const createRoom = async (ctx: Context) => {
  const newRoom = (await ctx.request.body.json()) as Room;

  if (
    !(await roomColl.findOne({
      name: newRoom.name,
    }))
  ) {
    console.log("Creating new room");
    const room_id = await roomColl.insertOne({
      name: newRoom.name,
      users: newRoom.users,
      owner: newRoom.owner,
    });
    console.log("Created new room with id:" + room_id.insertedId);
  }
};
