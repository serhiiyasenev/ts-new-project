import { Task, TaskFilters } from "../types/tasks";

const tasks: Task[] = [
  {
    id: '1',
    title: 'Example task',
    description: 'An example task created on startup',
    status: 'todo',
    priority: 'medium',
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

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(t => t.id === id);
};

export const createTask = (data: Omit<Task, 'id' | 'createdAt'>): Task => {
  const nextId = (tasks.length ? Math.max(...tasks.map(t => Number(t.id))) + 1 : 1).toString();
  const newTask: Task = {
    id: nextId,
    createdAt: new Date().toISOString(),
    ...data
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch } as Task;
  return tasks[idx];
};

export const deleteTask = (id: string): boolean => {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
};

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
