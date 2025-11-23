import { Task, TaskFilters } from "../types/tasks";

const tasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: 'Example task 1',
    description: 'An example task created on startup 1',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Example task 2',
    description: 'An example task created on startup 2',
    status: 'in_progress',
    priority: 'low',
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: 'Example task 3',
    description: 'An example task created on startup 3',
    status: 'done',
    priority: 'high',
    createdAt: new Date().toISOString()
  }
];

export const getAllTasks = (filters?: TaskFilters): Task[] => {
  let result = tasks.slice();
  if (!filters) return result;

  if (filters.createdAt) {
    const prefix = filters.createdAt;
    result = result.filter(t => t.createdAt.startsWith(prefix));
  }

  if (filters.status && filters.status.length) {
    result = result.filter(t => filters.status!.includes(t.status));
  }

  if (filters.priority && filters.priority.length) {
    result = result.filter(t => filters.priority!.includes(t.priority));
  }

  if (filters.title) {
    const q = filters.title.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(q));
  }

  return result;
};

export const createTask = (data: Omit<Task, 'id' | 'createdAt'>): Task => {
  const newTask: Task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data
  };
  tasks.push(newTask);
  return newTask;
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(t => t.id === id);
};

export const updateTask = (id: string, updatedData: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return null;
  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData } as Task;
  return tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return false;
  tasks.splice(taskIndex, 1);
  return true;
};
