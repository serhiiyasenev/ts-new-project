import { z } from 'zod';

export const bodyParamsSchema = z.object({
  name: z.string().min(3)
});

export const queryUsersSchema = z.object({
  createdAt: z.string().optional().refine((s) => !s || !Number.isNaN(Date.parse(s)), { message: 'createdAt must be a valid date string' }),
  name: z.string().optional()
});