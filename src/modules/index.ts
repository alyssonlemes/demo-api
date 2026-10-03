import { Router } from "express";
import { AppModule } from "../core/module";
import { authModule } from "./auth/auth.module";
import { usersModule } from "./users/users.module";

const modules: AppModule[] = [authModule, usersModule];

export function registerModules() {
  const router = Router();

  for (const module of modules) {
    router.use(module.path, module.router);
  }

  return router;
}
