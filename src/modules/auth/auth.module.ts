import { Router } from "express";
import { AppModule } from "../../core/module";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import { usersRepository } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.get("/me", authenticate, authController.me);

export const authModule: AppModule = {
  name: "auth",
  path: "/auth",
  router: authRouter,
};
