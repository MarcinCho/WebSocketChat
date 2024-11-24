import room from "./Room.ts";

export default class ConnectionDetails {
  connection_id: string;
  active_rooms?: Array<room>;
  conn_user: string;
  started_at: string;
  authorized: boolean;

  constructor(conn_user: string) {
    this.connection_id = crypto.randomUUID();
    this.started_at = new Date().toISOString();
    this.conn_user = conn_user;
    this.authorized = false;
  }
}
