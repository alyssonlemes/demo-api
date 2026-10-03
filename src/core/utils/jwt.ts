import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../../config/env";

export interface TokenPayload {
  sub: string;
  role: Role;
}

export function signToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === "string" || !decoded.sub || !decoded.role) {
    throw new Error("Token inválido");
  }

  return {
    sub: decoded.sub,
    role: decoded.role as Role,
  };
}
