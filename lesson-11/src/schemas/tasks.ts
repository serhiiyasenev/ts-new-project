import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});


export const queryTasksSchema = z.object({
  createdAt: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional()
});