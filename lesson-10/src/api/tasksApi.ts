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
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, id: String(newId) }),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  return await response.json();
};
export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};
