/**
 * Unit tests for task converter utilities
 */
import { describe, it, expect } from 'vitest';
import { convertFormDataToTask, convertTaskToFormData } from '../../src/utils/taskConverters';
import type { Task } from '../../src/types/types';
import type { TaskFormData } from '../../src/schemas/taskSchema';

describe('taskConverters', () => {
    describe('convertFormDataToTask', () => {
        it('converts form data to task object', () => {
            const formData: TaskFormData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'todo',
                priority: 'high',
                deadline: '2024-12-31',
            };

            const result = convertFormDataToTask(formData);

            expect(result.title).toBe('Test Task');
            expect(result.description).toBe('Test Description');
            expect(result.status).toBe('todo');
            expect(result.priority).toBe('high');
            expect(result.deadline).toBeInstanceOf(Date);
        });

        it('handles empty deadline', () => {
            const formData: TaskFormData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            };

            const result = convertFormDataToTask(formData);

            expect(result.deadline).toBeNull();
        });

        it('converts deadline string to Date object', () => {
            const formData: TaskFormData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'in_progress',
                priority: 'low',
                deadline: '2024-06-15',
            };

            const result = convertFormDataToTask(formData);

            expect(result.deadline).toBeInstanceOf(Date);
            expect(result.deadline?.toISOString().split('T')[0]).toBe('2024-06-15');
        });

        it('does not include id and createdAt', () => {
            const formData: TaskFormData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'done',
                priority: 'high',
                deadline: '2024-12-31',
            };

            const result = convertFormDataToTask(formData);

            expect(result).not.toHaveProperty('id');
            expect(result).not.toHaveProperty('createdAt');
        });
    });

    describe('convertTaskToFormData', () => {
        it('converts task object to form data', () => {
            const task: Task = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: 'todo',
                priority: 'high',
                createdAt: new Date('2024-01-01'),
                deadline: new Date('2024-12-31'),
            };

            const result = convertTaskToFormData(task);

            expect(result.title).toBe('Test Task');
            expect(result.description).toBe('Test Description');
            expect(result.status).toBe('todo');
            expect(result.priority).toBe('high');
            expect(result.deadline).toBe('2024-12-31');
        });

        it('handles null deadline', () => {
            const task: Task = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: 'todo',
                priority: 'medium',
                createdAt: new Date('2024-01-01'),
                deadline: null,
            };

            const result = convertTaskToFormData(task);

            expect(result.deadline).toBe('');
        });

        it('converts Date to ISO date string', () => {
            const task: Task = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: 'in_progress',
                priority: 'low',
                createdAt: new Date('2024-01-01'),
                deadline: new Date('2024-06-15T12:00:00Z'),
            };

            const result = convertTaskToFormData(task);

            expect(result.deadline).toBe('2024-06-15');
        });

        it('preserves all task properties', () => {
            const task: Task = {
                id: '123',
                title: 'Important Task',
                description: 'Very detailed description',
                status: 'done',
                priority: 'high',
                createdAt: new Date(),
                deadline: new Date('2025-01-01'),
            };

            const result = convertTaskToFormData(task);

            expect(result.title).toBe(task.title);
            expect(result.description).toBe(task.description);
            expect(result.status).toBe(task.status);
            expect(result.priority).toBe(task.priority);
        });
    });
});
