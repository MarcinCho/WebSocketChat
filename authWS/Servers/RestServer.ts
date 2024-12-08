import { Application } from "@oak/oak";
import router from "../Routes/Routes.ts";

export const RestServer = async (port: number) => {
  const app = new Application();

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("REST API listening on port %s", port);
  await app.listen({ port });
};
