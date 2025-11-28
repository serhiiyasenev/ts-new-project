import { TaskPriority, TaskStatus } from "../schemas/tasks";

export interface UserFilters {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
  userId?: number;
}

export interface PostFilters {
  title?: string;
  content?: string;
  userId?: number;
}
