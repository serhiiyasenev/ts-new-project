import type { Task, CreateTaskData } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`/api/tasks?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  const tasks = await response.json();
  if (!tasks || tasks.length === 0) {
    throw new Error('Task not found');
  }
  return tasks[0];
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const newTask = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
};
