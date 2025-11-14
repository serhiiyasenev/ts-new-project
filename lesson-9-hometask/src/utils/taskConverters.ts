/**
 * Utility functions for converting between Task and TaskFormData formats
 */
import type { TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/types';

export const convertFormDataToTask = (data: TaskFormData): Omit<Task, 'id' | 'createdAt'> => {
    return {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        deadline: data.deadline ? new Date(data.deadline) : null,
    };
};

export const convertTaskToFormData = (task: Task): TaskFormData => {
    return {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline
            ? new Date(task.deadline).toISOString().split('T')[0]
            : '',
    };
};
