import { Router } from "express";
import { AppModule } from "../../core/module";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { listUsersSchema, updateUserSchema, userIdSchema } from "./users.schema";
import { UsersService } from "./users.service";

const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

export const usersRouter = Router();

usersRouter.get("/", authenticate, validate(listUsersSchema), usersController.list);
usersRouter.get("/:id", authenticate, validate(userIdSchema), usersController.show);
usersRouter.patch("/:id", authenticate, validate(updateUserSchema), usersController.update);
usersRouter.delete("/:id", authenticate, validate(userIdSchema), usersController.remove);

export const usersModule: AppModule = {
  name: "users",
  path: "/users",
  router: usersRouter,
};

export { usersRepository };
