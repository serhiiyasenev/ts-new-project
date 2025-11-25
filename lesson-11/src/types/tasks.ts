export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilters = {
  createdAt?: string; 
  status?: TaskStatus[];
  priority?: TaskPriority[];
  title?: string;
};
