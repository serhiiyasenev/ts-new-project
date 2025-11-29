// Import enums from response DTO to avoid duplication
import { TaskPriority, TaskStatus } from "./taskResponse.dto";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number | null;
}
