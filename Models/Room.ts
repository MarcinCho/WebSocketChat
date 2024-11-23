import roomOptions from "./roomOptions.ts";
import user from "./user.ts";

export default class Room {
  id?: string;
  name?: string;
  users?: Array<user> | Array<string>; // Users as a class ?? // USER
  // get users public keys where user not current user logdin user or whatever-
  options?: roomOptions;

/*************  ✨ Codeium Command 🌟  *************/
  constructor(id: string, name?: string, users?: Array<user | string>, options?: roomOptions) {
  constructor(
    id: string,
    name?: string,
    users?: Array<user> | Array<string>,
    options?: roomOptions
  ) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.options = options ?? new roomOptions();
    this.options = options;
  }
/******  c1f79baf-5a63-4644-ae1d-59adb4c7169b  *******/
}
