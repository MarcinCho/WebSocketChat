import { Context } from "@oak/oak";
import { authorize } from "../AuthUtils/authorize.ts";

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
  const payload = authorize(authHeader);
  if (payload) {
    ctx.state.user = payload;
    console.log(payload);
    await next();
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      message: "Unauthorized : token format not valid",
    };
  }
};
