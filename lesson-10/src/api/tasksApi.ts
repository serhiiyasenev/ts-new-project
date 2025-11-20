import type { Task, CreateTaskData } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
    const tasks = await fetchTasks();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(u => u.id)) : 0;
    const newId = maxId + 1;
    // This was done specifically to generate incremental number IDs,
    //  because otherwise, json-server creates them as random strings.
    const newTask = {
      ...data,
      id: newId
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

export const fetchTaskById = async (id: number): Promise<Task> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid task ID: must be a positive integer');
  }
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  const tasks = await response.json();
  if (!tasks || tasks.length === 0) {
    throw new Error('Task not found');
  }
  return tasks[0];
};


