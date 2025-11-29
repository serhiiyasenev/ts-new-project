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

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number;
}

export interface TaskQueryParams {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
  groupBy?: "status";
}

export interface TasksGroupedByStatus {
  todo: Task[];
  in_progress: Task[];
  review: Task[];
  done: Task[];
}
