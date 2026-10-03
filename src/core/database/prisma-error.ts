import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error";

export function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AppError("E-mail já cadastrado", 409);
    }

    if (error.code === "P2025") {
      throw new AppError("Usuário não encontrado", 404);
    }
  }

  throw error;
}
