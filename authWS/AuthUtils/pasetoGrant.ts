// https://github.com/auth70/paseto-ts
import { generateKeys, encrypt, decrypt } from "paseto-ts/v4";
import user from "../Models/User.ts";

const localKey = generateKeys("local");

export const grantPaseto = async (user: user) => {
  const payload = {
    user_id: user._id,
    username: user.username,
  };

  try {
    const token = await encrypt(localKey, payload);
    return token;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const decryptPaseto = (token: string) => {
  try {
    const { payload } = decrypt(localKey, token);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
