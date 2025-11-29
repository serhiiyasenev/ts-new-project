import { z } from "zod";
import { TaskStatus, TaskPriority } from "../dtos/taskResponse.dto";

export { TaskStatus, TaskPriority };

const VALID_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.Todo]: [
    TaskStatus.InProgress,
    TaskStatus.Review,
    TaskStatus.Done,
  ],
  [TaskStatus.InProgress]: [
    TaskStatus.Todo,
    TaskStatus.Review,
    TaskStatus.Done,
  ],
  [TaskStatus.Review]: [
    TaskStatus.Todo,
    TaskStatus.InProgress,
    TaskStatus.Done,
  ],
  [TaskStatus.Done]: [
    TaskStatus.Todo,
    TaskStatus.InProgress,
    TaskStatus.Review,
  ],
};

const baseTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim(),
  description: z
    .string()
    .max(5000, "Description must not exceed 5000 characters")
    .trim()
    .optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  userId: z
    .union([z.number().int().positive("User ID must be positive"), z.null()])
    .optional()
    .transform((val) => (val === undefined ? val : val)),
});

export const createTaskSchema = baseTaskSchema.extend({
  status: z.nativeEnum(TaskStatus).default(TaskStatus.Todo),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.Medium),
});

export const updateTaskSchema = baseTaskSchema.partial().refine(
  (data) => {
    // At least one field must be provided
    return Object.keys(data).length > 0;
  },
  {
    message: "At least one field must be provided for update",
  },
);

export function validateStatusTransition(
  currentStatus: TaskStatus,
  newStatus: TaskStatus,
): boolean {
  if (currentStatus === newStatus) return true;
  return VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export const statusTransitionSchema = z
  .object({
    currentStatus: z.nativeEnum(TaskStatus),
    newStatus: z.nativeEnum(TaskStatus),
  })
  .refine(
    (data) => validateStatusTransition(data.currentStatus, data.newStatus),
    {
      message: "Invalid status transition",
    },
  );

export const queryTasksSchema = z.object({
  status: z
    .string()
    .optional()
    .transform((val) =>
      val
        ?.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    )
    .pipe(z.array(z.nativeEnum(TaskStatus)).optional()),

  priority: z
    .string()
    .optional()
    .transform((val) =>
      val
        ?.split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    )
    .pipe(z.array(z.nativeEnum(TaskPriority)).optional()),

  title: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val.trim())
    .optional(),
  userId: z
    .union([
      z.number().int().positive(),
      z
        .string()
        .regex(/^\d+$/, "userId must be numeric")
        .transform((val) => parseInt(val, 10)),
    ])
    .optional(),
  groupBy: z.enum(["status"]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
