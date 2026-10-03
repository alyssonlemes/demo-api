import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { AppError } from "./core/errors/app-error";
import { errorMiddleware } from "./core/middlewares/error.middleware";
import { registerModules } from "./modules";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "ok" });
  });

  app.use("/api", registerModules());

  app.use((_req, _res, next) => {
    next(new AppError("Rota não encontrada", 404));
  });

  app.use(errorMiddleware);

  return app;
}
