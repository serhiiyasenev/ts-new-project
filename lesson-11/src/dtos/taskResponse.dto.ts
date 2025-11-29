import { TaskModel } from "../models/task.model";

// Define enums locally for TSOA
export enum TaskStatus {
  Todo = "todo",
  InProgress = "in_progress",
  Review = "review",
  Done = "done",
}

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

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

export interface TasksGroupedByStatusDto {
  todo: TaskResponseDto[];
  in_progress: TaskResponseDto[];
  review: TaskResponseDto[];
  done: TaskResponseDto[];
}

export function mapTaskModelToDto(model: TaskModel): TaskResponseDto {
  return {
    id: model.id,
    title: model.title,
    description: model.description ?? undefined,
    status: model.status as TaskStatus,
    priority: model.priority as TaskPriority,
    userId: model.userId ?? null,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

export function groupTasksByStatus(
  tasks: TaskModel[],
): TasksGroupedByStatusDto {
  const grouped: TasksGroupedByStatusDto = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    const dto = mapTaskModelToDto(task);
    const status = task.status as TaskStatus;
    grouped[status].push(dto);
  });

  return grouped;
}
