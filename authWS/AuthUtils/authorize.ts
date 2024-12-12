import { validateJWT } from "./jwtGrant.ts";
import { decryptPaseto } from "./pasetoGrant.ts";

// for now im setting issuer since i cant fix the types
export const authorize = async (token: string) => {
  if (token.startsWith("v4.")) {
    return decryptPaseto(token);
  } else if (token.startsWith("ey")) {
    // standard JWT implementation almost always produce token with ey at the begining
    return await validateJWT(token);
  } else {
    return false;
  }
};
