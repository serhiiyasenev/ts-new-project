import { z } from 'zod';

export const bodyParamsSchema = z.object({
  name: z.string().min(3),
  email: z.email()
});

export const updateBodySchema = z.object({
  name: z.string().min(3).optional(),
  email: z.email().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export const queryUsersSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional()
});

export const userIdSchema = z.string()
  .min(1, { message: "Missing user id" })
  .regex(/^([1-9]\d*)$/, { message: "Invalid user id" });