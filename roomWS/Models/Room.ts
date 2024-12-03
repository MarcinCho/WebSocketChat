import roomOptions from "./roomOptions.ts";

export default class Room {
  id: string;
  name: string;
  users: Array<string>;
  options?: roomOptions;

  constructor(
    id: string,
    name: string,
    users: Array<string>,
    options?: roomOptions
  ) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.options = options;
  }
}
