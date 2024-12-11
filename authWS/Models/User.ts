import { ObjectId } from "mongodb";

export default class user {
  _id: ObjectId;
  username: string;
  created_at: string;
  email: string;
  public_key?: string;
  private_key?: string;
  password: string;

  constructor(
    _id: ObjectId,
    username: string,
    email: string,
    public_key: string,
    private_key: string,
    password: string
  ) {
    this._id = _id;
    this.username = username;
    this.created_at = new Date().toISOString();
    this.email = email;
    this.public_key = public_key;
    this.private_key = private_key;
    this.password = password;
  }
}
