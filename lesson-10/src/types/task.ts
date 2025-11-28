export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number | null;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number | null;
};
