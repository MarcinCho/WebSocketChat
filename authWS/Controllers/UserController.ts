import { Context } from "@oak/oak";
import * as bcrypt from "@da/bcrypt";

export const register = async (ctx: Context) => {
  const { _username, password } = await ctx.request.body.json();
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log(`pass: ${password} hash: ${passwordHash}`);
  ctx.response.body = {
    "oh it works": true,
  };
  ctx.response.status = 200;
};
