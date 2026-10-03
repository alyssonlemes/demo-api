import { Role } from "@prisma/client";
import { z } from "zod";

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      email: z.string().trim().email().optional(),
      password: z.string().min(6).optional(),
      role: z.nativeEnum(Role).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Informe ao menos um campo para atualizar",
    }),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>["query"];
export type UpdateUserBody = z.infer<typeof updateUserSchema>["body"];
