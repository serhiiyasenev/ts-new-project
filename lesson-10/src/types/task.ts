/**
 * @deprecated Use shared types from @shared/task.types instead
 */

// Re-export shared types for backward compatibility
export {
  TaskStatus,
  TaskPriority,
  type Task,
  type CreateTaskDto as CreateTaskData,
  type UpdateTaskDto as UpdateTaskData,
  type TasksGroupedByStatus,
} from "@shared/task.types";
