import type { Task } from './types';

const API_URL = import.meta.env.VITE_API_URL;

// Helper to safely read response text without throwing
async function readErrorText(response: Response): Promise<string> {
    try {
        const text = await response.text();
        return text?.trim() ?? '';
    } catch {
        return '';
    }
}

// Helper to throw detailed errors for non-OK responses
async function throwForBadResponse(response: Response, defaultMessage: string): Promise<void> {
    if (!response.ok) {
        const body = await readErrorText(response);
        const detail = [response.status.toString(), response.statusText, body]
            .filter(Boolean)
            .join(' ');
        throw new Error(`${defaultMessage}: ${detail}`);
    }
}

export const TaskAPI = {
    // Get all tasks
    async getAllTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tasks`);
        await throwForBadResponse(response, 'Failed to fetch tasks');
        return response.json();
    },

    // Get task by ID
    async getTaskById(id: string): Promise<Task> {
        const response = await fetch(`${API_URL}/tasks/${id}`);
        await throwForBadResponse(response, 'Failed to fetch task');
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
        await throwForBadResponse(response, 'Failed to create task');
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
        await throwForBadResponse(response, 'Failed to update task');
        return response.json();
    },

    // Delete task
    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        await throwForBadResponse(response, 'Failed to delete task');
    }
};
