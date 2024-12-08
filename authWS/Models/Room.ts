import roomOptions from "./RoomOptions.ts";

export default class Room {
  id: string;
  name: string;
  users: Array<string>;
  owner: string;
  options?: roomOptions;

  constructor(
    id: string,
    name: string,
    owner: string,
    users: Array<string>,
    options?: roomOptions
  ) {
    this.id = id;
    this.owner = owner;
    this.name = name;
    this.users = users;
    this.options = options;
  }
}
