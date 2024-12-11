import { Context, Router } from "@oak/oak";
import * as user from "../Controllers/UserController.ts";
import { authMiddleware } from "../Middleware/authMiddleware.ts";

const router = new Router();

router.post("/login", user.login).post("/register", user.register);

const protectedRouter = new Router();

protectedRouter.use(authMiddleware);

protectedRouter.get("/check", (ctx: Context) => {
  ctx.response.body = {
    message: "hello world",
  };
  ctx.response.status = 200;
});

router.use("/protected", protectedRouter.routes());

export default router;
