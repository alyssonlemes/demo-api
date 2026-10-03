import { Role } from "@prisma/client";
import { AppError } from "../../core/errors/app-error";
import { AuthUser } from "../../core/middlewares/auth.middleware";
import { hashPassword } from "../../core/utils/password";
import { ListUsersQuery, UpdateUserBody } from "./users.schema";
import { UsersRepository } from "./users.repository";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async list(query: ListUsersQuery) {
    const page = query.page;
    const limit = query.limit;
    const { data, total } = await this.usersRepository.findMany({
      skip: (page - 1) * limit,
      take: limit,
      search: query.search,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  }

  async update(id: string, input: UpdateUserBody, actor: AuthUser) {
    this.assertCanManage(id, actor);

    if (input.role && actor.role !== Role.ADMIN) {
      throw new AppError("Apenas administradores podem alterar o papel", 403);
    }

    await this.getById(id);

    const password = input.password ? await hashPassword(input.password) : undefined;

    return this.usersRepository.update(id, {
      name: input.name,
      email: input.email?.toLowerCase(),
      password,
      role: input.role,
    });
  }

  async remove(id: string, actor: AuthUser) {
    this.assertCanManage(id, actor);
    await this.getById(id);
    await this.usersRepository.delete(id);
  }

  private assertCanManage(targetId: string, actor: AuthUser) {
    if (actor.id !== targetId && actor.role !== Role.ADMIN) {
      throw new AppError("Sem permissão para alterar este usuário", 403);
    }
  }
}
