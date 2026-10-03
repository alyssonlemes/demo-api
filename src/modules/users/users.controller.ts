import { Request, Response } from "express";
import { asyncHandler } from "../../core/utils/async-handler";
import { AppError } from "../../core/errors/app-error";
import { ListUsersQuery, UpdateUserBody } from "./users.schema";
import { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.usersService.list(req.query as unknown as ListUsersQuery);

    return res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  });

  show = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.usersService.getById(req.params.id);

    return res.json({
      success: true,
      data: user,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const user = await this.usersService.update(
      req.params.id,
      req.body as UpdateUserBody,
      req.user,
    );

    return res.json({
      success: true,
      data: user,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    await this.usersService.remove(req.params.id, req.user);

    return res.status(204).send();
  });
}
