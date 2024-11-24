import roomOptions from "./roomOptions.ts";
import user from "./user.ts";

export default class Room {
  id?: string;
  name?: string;
  users?: Array<string>;
  // users?: Array<user> | Array<string>; // Users as a class ?? // USER
  // get users public keys where user not current user logdin user or whatever-
  options?: roomOptions;

  constructor(
    id: string,
    name?: string,
    users?: Array<string>,
    options?: roomOptions
  ) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.options = options;
  }
}
