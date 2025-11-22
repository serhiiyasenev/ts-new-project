import { z } from 'zod';

export const bodyParamsSchema = z.object({
  name: z.string().min(3)
});