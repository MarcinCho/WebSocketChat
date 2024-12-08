import { Application, Context, Router } from "@oak/oak";
import { db } from "./main.ts";

export const RestServer = async (port: number) => {
  const app = new Application();
  const router = new Router();

  router
    .get("/", (ctx: Context) => {
      ctx.response.body = {
        message: "hello world",
      };
      ctx.response.status = 200;
    })
    .get("/msg", async (ctx: Context) => {
      ctx.response.body = (await db).collection("messages").find();
    })
    .get("/rooms", async (ctx: Context) => {
      ctx.response.body = (await db).collection("rooms").find();
    });
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("REST API listening on port %s", port);
  await app.listen({ port });
};
