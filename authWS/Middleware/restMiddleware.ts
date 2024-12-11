import { Context } from "@oak/oak";
import { validateJWT } from "../AuthUtils/jwtGrant.ts";
import { decryptPaseto } from "../AuthUtils/pasetoGrant.ts";

export const authMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>
) => {
  const authHeader = ctx.request.headers.get("Authorization")?.split(" ")[1];

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = {
      message: "Unauthorized",
    };
    return;
  }
  if (authHeader.startsWith("v4.")) {
    const user = decryptPaseto(authHeader);
    console.log(user);
    await next();
  } else if (authHeader.startsWith("ey")) {
    // standard JWT implementation almost always produce token with ey at the begining
    ctx.state.user = await validateJWT(authHeader);
    await next();
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      message: "Unauthorized : token format not valid",
    };
  }
};
