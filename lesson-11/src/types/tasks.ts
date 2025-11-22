export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
};

export type TaskFilters = {
  createdAt?: string; 
  status?: TaskStatus[];
  priority?: TaskPriority[];
};
