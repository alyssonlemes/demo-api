import { AuthUser } from "../core/middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
