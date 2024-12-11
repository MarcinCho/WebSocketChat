import roomOptions from "./RoomOptions.ts";
import { ObjectId } from "mongodb";

export default class Room {
  _id?: ObjectId;
  name: string;
  users: string[];
  owner: string;
  options?: roomOptions;

  constructor(
    name: string,
    users: string[],
    owner: string,
    options?: roomOptions
  ) {
    this.owner = owner;
    this.name = name;
    this.users = users;
    this.options = options;
  }
}
