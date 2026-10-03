import { AppError } from "../../core/errors/app-error";
import { comparePassword, hashPassword } from "../../core/utils/password";
import { signToken } from "../../core/utils/jwt";
import { UsersRepository } from "../users/users.repository";
import { LoginBody, RegisterBody } from "./auth.schema";

export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(input: RegisterBody) {
    const email = input.email.toLowerCase();
    const existing = await this.usersRepository.findByEmail(email);

    if (existing) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    const user = await this.usersRepository.create({
      name: input.name,
      email,
      password: await hashPassword(input.password),
    });

    const token = signToken({ sub: user.id, role: user.role });

    return { user, token };
  }

  async login(input: LoginBody) {
    const user = await this.usersRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatches = await comparePassword(input.password, user.password);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const token = signToken({ sub: user.id, role: user.role });
    const { password: _password, ...publicUser } = user;

    return { user: publicUser, token };
  }

  async me(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return user;
  }
}
