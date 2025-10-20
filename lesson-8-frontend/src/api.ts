import type { Task } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export const TaskAPI = {
    // Get all tasks
    async getAllTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    // Get task by ID
    async getTaskById(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    // Create new task
    async createTask(task: Omit<Task, 'id'>): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    // Update task
    async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    // Delete task
    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');
    }
};