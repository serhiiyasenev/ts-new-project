import { TaskPriority, TaskStatus } from "../schemas/tasks";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number;
}

export interface UpdateTaskDto extends Partial<Omit<CreateTaskDto, "userId">> {
  userId?: number | null;
}
