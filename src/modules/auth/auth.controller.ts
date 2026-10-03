import { Request, Response } from "express";
import { AppError } from "../../core/errors/app-error";
import { asyncHandler } from "../../core/utils/async-handler";
import { LoginBody, RegisterBody } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body as RegisterBody);

    return res.status(201).json({
      success: true,
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body as LoginBody);

    return res.json({
      success: true,
      data: result,
    });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const user = await this.authService.me(req.user.id);

    return res.json({
      success: true,
      data: user,
    });
  });
}
