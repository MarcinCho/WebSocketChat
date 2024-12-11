// https://github.com/panva/jose
// https://developer.okta.com/blog/2019/10/17/a-thorough-introduction-to-paseto

import { jwtVerify, SignJWT } from "jose";
import user from "../Models/User.ts";

const secret = new TextEncoder().encode(Deno.env.get("JWT_KEY") ?? "");

export const grantJWT = async (user: user) => {
  const payload = {
    user_id: user._id,
    username: user.username,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(secret);
  return jwt;
};

export const validateJWT = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    console.log(payload);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
