import { TaskModel } from "../models/task.model";
import { TaskPriority, TaskStatus } from "../schemas/tasks";

export interface TaskResponseDto {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}

export function mapTaskModelToDto(model: TaskModel): TaskResponseDto {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    status: model.status as TaskStatus,
    priority: model.priority as TaskPriority,
    userId: model.userId ?? null,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}
