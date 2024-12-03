import user from "./user.ts";

export default class roomOptions {
  owner: user;
  max_decrypted_msg: number;
  deleted_after_days: number;
  isPrivate: boolean;
  max_users: number;
  publicKeyForRoomUsers: string; // combination of all users public keys beside owner
  // to think about sign as encrypt for and technicaly I can even add support for choosing who will be able to decrypt
}
