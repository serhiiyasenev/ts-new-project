import { z } from "zod";

export const TaskStatusEnum = z.enum(["todo", "in_progress", "done"]);
export const TaskPriorityEnum = z.enum(["low", "medium", "high"]);

export type TaskStatus = z.infer<typeof TaskStatusEnum>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;

export type TaskFilters = {
  createdAt?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
};

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const queryTasksSchema = z.object({
  createdAt: z
    .string()
    .optional()
    .refine(
      (s) => !s || !Number.isNaN(Date.parse(s)),
      { message: "createdAt must be a valid date string" }
    ),
  status: z.string().optional(),
  priority: z.string().optional(),
  title: z.string().optional()
});

export const taskIdSchema = z
  .string()
  .refine((v) => /^\d+$/.test(v), {
    message: "Task ID must be a numeric value",
  });
