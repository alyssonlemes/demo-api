import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../errors/app-error";
import { verifyToken } from "../utils/jwt";

export interface AuthUser {
  id: string;
  role: Role;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError("Token não informado", 401);
  }

  try {
    const payload = verifyToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Sem permissão para esta ação", 403);
    }

    next();
  };
}
