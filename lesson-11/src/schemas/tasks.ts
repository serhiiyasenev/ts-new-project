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

export type TaskFilters = {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
};

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number | undefined;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum([
    TaskStatus.Todo,
    TaskStatus.InProgress,
    TaskStatus.Done
  ]).optional(),
  priority: z.enum([
    TaskPriority.Low,
    TaskPriority.Medium,
    TaskPriority.High
  ]).optional(),
  userId: z.number().int().positive().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const queryTasksSchema = z.object({
  status: z.string().optional()
    .transform((val) => val?.split(","))
    .pipe(
      z.array(z.enum([
        TaskStatus.Todo,
        TaskStatus.InProgress,
        TaskStatus.Done
      ])).optional()
    ),

  priority: z.string().optional()
    .transform((val) => val?.split(","))
    .pipe(
      z.array(z.enum([
        TaskPriority.Low,
        TaskPriority.Medium,
        TaskPriority.High
      ])).optional()
    ),

  title: z.string().optional()
});
