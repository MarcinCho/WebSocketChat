import { Context, Router } from "@oak/oak";
import db from "../Database/dbConnection.ts";
import appKey from "../Utils/appKey.ts";
import { register } from "../Controllers/UserController.ts";

const router = new Router();

router
  .get("/", (context: Context) => {
    context.response.body = {
      message: "hello world +" + appKey.algorithm.name,
    };
    context.response.status = 200;
  })
  .get("/msg", async (ctx: Context) => {
    ctx.response.body = (await db).collection("messages").find();
  })
  .get("/rooms", async (ctx: Context) => {
    ctx.response.body = (await db).collection("rooms").find();
  })
  .post("/register", register);

export default router;
