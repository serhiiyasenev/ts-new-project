import { z } from "zod";
import { TaskStatus, TaskPriority } from "@shared/task.types";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  userId: z.any().optional(),
});

export type TaskFormFields = z.infer<typeof taskSchema>;
