import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  userId: z.any().optional(),
});

export type TaskFormFields = z.infer<typeof taskSchema>;
