import { z } from "zod";

export enum TaskStatus {
  Todo = "todo",
  InProgress = "in_progress",
  Done = "done"
}

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high"
}

const baseTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  userId: z
    .union([z.number().int().positive(), z.null()])
    .optional()
    .transform((val) => (val === undefined ? val : val)),
});

export const createTaskSchema = baseTaskSchema.extend({
  status: baseTaskSchema.shape.status.default(TaskStatus.Todo),
  priority: baseTaskSchema.shape.priority.default(TaskPriority.Medium),
});

export const updateTaskSchema = baseTaskSchema.partial();

export const queryTasksSchema = z.object({
  status: z.string().optional()
    .transform((val) =>
      val
        ?.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
    .pipe(
      z.array(z.nativeEnum(TaskStatus)).optional()
    ),

  priority: z.string().optional()
    .transform((val) =>
      val
        ?.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    )
    .pipe(
      z.array(z.nativeEnum(TaskPriority)).optional()
    ),

  title: z.string().trim().min(1).transform((val) => val.trim()).optional(),
  userId: z
    .union([
      z.number().int().positive(),
      z
        .string()
        .regex(/^\d+$/, "userId must be numeric")
        .transform((val) => parseInt(val, 10))
    ])
    .optional()
});
