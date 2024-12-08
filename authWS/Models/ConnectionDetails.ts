import room from "./Room.ts";

export default interface ConnectionDetails {
  active_rooms?: Array<room>;
  user_id: string;
  started_at: string;
  authorized: boolean;
}
