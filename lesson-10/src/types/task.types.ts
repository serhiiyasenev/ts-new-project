export type Task = {
  id: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  dueDate: string;
  createdAt: string;
};

export type CreateTaskData = Omit<Task, 'id' | 'createdAt'>;
