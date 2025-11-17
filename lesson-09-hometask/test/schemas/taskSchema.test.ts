/**
 * Unit tests for Zod task validation schema
 */
import { describe, it, expect } from 'vitest';
import { taskFormSchema } from '../../src/schemas/taskSchema';

describe('taskFormSchema', () => {
    describe('title validation', () => {
        it('accepts valid title', () => {
            const result = taskFormSchema.safeParse({
                title: 'Valid Task Title',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(true);
        });

        it('rejects empty title', () => {
            const result = taskFormSchema.safeParse({
                title: '',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title is required');
            }
        });

        it('rejects title over 100 characters', () => {
            const longTitle = 'a'.repeat(101);
            const result = taskFormSchema.safeParse({
                title: longTitle,
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Title must be less than 100 characters');
            }
        });
    });

    describe('description validation', () => {
        it('accepts valid description', () => {
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Valid description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(true);
        });

        it('rejects empty description', () => {
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: '',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Description is required');
            }
        });

        it('rejects description over 500 characters', () => {
            const longDescription = 'a'.repeat(501);
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: longDescription,
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Description must be less than 500 characters');
            }
        });
    });

    describe('status validation', () => {
        it('accepts valid status values', () => {
            const statuses = ['todo', 'in_progress', 'done'] as const;

            statuses.forEach(status => {
                const result = taskFormSchema.safeParse({
                    title: 'Title',
                    description: 'Description',
                    status,
                    priority: 'medium',
                    deadline: '',
                });

                expect(result.success).toBe(true);
            });
        });

        it('rejects invalid status', () => {
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'invalid',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(false);
        });
    });

    describe('priority validation', () => {
        it('accepts valid priority values', () => {
            const priorities = ['low', 'medium', 'high'] as const;

            priorities.forEach(priority => {
                const result = taskFormSchema.safeParse({
                    title: 'Title',
                    description: 'Description',
                    status: 'todo',
                    priority,
                    deadline: '',
                });

                expect(result.success).toBe(true);
            });
        });

        it('rejects invalid priority', () => {
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'todo',
                priority: 'invalid',
                deadline: '',
            });

            expect(result.success).toBe(false);
        });
    });

    describe('deadline validation', () => {
        it('accepts empty deadline', () => {
            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: '',
            });

            expect(result.success).toBe(true);
        });

        it('accepts future date', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const futureDate = tomorrow.toISOString().split('T')[0];

            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: futureDate,
            });

            expect(result.success).toBe(true);
        });

        it('accepts today date', () => {
            const today = new Date().toISOString().split('T')[0];

            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: today,
            });

            expect(result.success).toBe(true);
        });

        it('rejects past date', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const pastDate = yesterday.toISOString().split('T')[0];

            const result = taskFormSchema.safeParse({
                title: 'Title',
                description: 'Description',
                status: 'todo',
                priority: 'medium',
                deadline: pastDate,
            });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Deadline cannot be in the past');
            }
        });
    });
});
