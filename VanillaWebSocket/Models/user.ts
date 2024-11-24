export default class user {
  id?: string;
  username: string;
  created_at?: string;
  email?: string;
  public_key?: string;
  private_key?: string;
  password?: string;

  constructor(
    id: string,
    username: string,
    created_at: string,
    email: string,
    public_key: string,
    private_key: string,
    password: string
  ) {
    this.id = id;
    this.username = username;
    this.created_at = created_at;
    this.email = email;
    this.public_key = public_key;
    this.private_key = private_key;
    this.password = password;
  }
}
