import { Router } from "express";
import { protect } from "../middlewares/protect";

import { register, login, getProfile } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/:userId", [protect], getProfile);

export default authRouter;
