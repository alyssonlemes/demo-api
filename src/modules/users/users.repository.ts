import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { rethrowPrismaError } from "../../core/database/prisma-error";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface ListUsersFilters {
  skip: number;
  take: number;
  search?: string;
}

export class UsersRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  async findMany({ skip, take, search }: ListUsersFilters) {
    const where: Prisma.UserWhereInput | undefined = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: publicUserSelect,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total };
  }

  async create(data: CreateUserData) {
    try {
      return await prisma.user.create({
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async update(id: string, data: UpdateUserData) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: publicUserSelect,
      });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      rethrowPrismaError(error);
    }
  }
}
