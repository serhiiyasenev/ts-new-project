import { describe, it, expect, beforeEach } from 'vitest';
import { sortTasksByCreatedDate } from '../src/main';
import { capitalize } from '../src/dom-utils';
import { formDataToTask, formDataToPartialTask } from '../src/form-utils';
import { setupTestDom } from './helpers';
import { createSampleTask } from './helpers';
import type { Task } from '../src/types';

beforeEach(() => {
  setupTestDom();
});

describe('Utility Functions', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('low')).toBe('Low');
      expect(capitalize('medium')).toBe('Medium');
      expect(capitalize('high')).toBe('High');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should not change already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });
  });

  describe('sortTasksByCreatedDate', () => {
    it('should sort tasks by created date in descending order (newest first)', () => {
      const tasks: Task[] = [
        createSampleTask({ id: '1', createdAt: new Date('2024-01-01') }),
        createSampleTask({ id: '2', createdAt: new Date('2024-01-03') }),
        createSampleTask({ id: '3', createdAt: new Date('2024-01-02') }),
      ];

      const sorted = sortTasksByCreatedDate(tasks);

      expect(sorted[0].id).toBe('2'); // 2024-01-03
      expect(sorted[1].id).toBe('3'); // 2024-01-02
      expect(sorted[2].id).toBe('1'); // 2024-01-01
    });

    it('should not mutate the original array', () => {
      const tasks: Task[] = [
        createSampleTask({ id: '1', createdAt: new Date('2024-01-01') }),
        createSampleTask({ id: '2', createdAt: new Date('2024-01-03') }),
      ];

      const original = [...tasks];
      sortTasksByCreatedDate(tasks);

      expect(tasks).toEqual(original);
    });

    it('should handle empty array', () => {
      const sorted = sortTasksByCreatedDate([]);
      expect(sorted).toEqual([]);
    });

    it('should handle single task', () => {
      const tasks = [createSampleTask()];
      const sorted = sortTasksByCreatedDate(tasks);
      expect(sorted).toHaveLength(1);
      expect(sorted[0]).toEqual(tasks[0]);
    });
  });

  describe('formDataToTask', () => {
    it('should convert FormData to Task object', () => {
      const formData = new FormData();
      formData.set('title', 'Test Task');
      formData.set('description', 'Test Description');
      formData.set('status', 'todo');
      formData.set('priority', 'high');
      formData.set('deadline', '2024-12-31');

      const task = formDataToTask(formData);

      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('high');
      expect(task.deadline).toBeInstanceOf(Date);
      expect(task.deadline?.toISOString().split('T')[0]).toBe('2024-12-31');
      expect(task.createdAt).toBeInstanceOf(Date);
    });

    it('should handle null deadline', () => {
      const formData = new FormData();
      formData.set('title', 'Test Task');
      formData.set('description', 'Test Description');
      formData.set('status', 'todo');
      formData.set('priority', 'low');
      formData.set('deadline', '');

      const task = formDataToTask(formData);

      expect(task.deadline).toBeNull();
    });
  });

  describe('formDataToPartialTask', () => {
    it('should convert FormData to partial Task object', () => {
      const formData = new FormData();
      formData.set('title', 'Updated Task');
      formData.set('description', 'Updated Description');
      formData.set('status', 'in_progress');
      formData.set('priority', 'medium');
      formData.set('deadline', '2025-01-15');

      const partial = formDataToPartialTask(formData);

      expect(partial.title).toBe('Updated Task');
      expect(partial.description).toBe('Updated Description');
      expect(partial.status).toBe('in_progress');
      expect(partial.priority).toBe('medium');
      expect(partial.deadline).toBeInstanceOf(Date);
      expect(partial).not.toHaveProperty('id');
      expect(partial).not.toHaveProperty('createdAt');
    });

    it('should handle null deadline', () => {
      const formData = new FormData();
      formData.set('title', 'Updated Task');
      formData.set('description', 'Updated Description');
      formData.set('status', 'done');
      formData.set('priority', 'low');
      formData.set('deadline', '');

      const partial = formDataToPartialTask(formData);

      expect(partial.deadline).toBeNull();
    });

    it('should throw error for invalid status', () => {
      const formData = new FormData();
      formData.set('title', 'Test Task');
      formData.set('description', 'Test Description');
      formData.set('status', 'invalid_status');
      formData.set('priority', 'high');

      expect(() => formDataToPartialTask(formData)).toThrow('Please select a valid status');
    });

    it('should throw error for invalid priority', () => {
      const formData = new FormData();
      formData.set('title', 'Test Task');
      formData.set('description', 'Test Description');
      formData.set('status', 'todo');
      formData.set('priority', 'invalid_priority');

      expect(() => formDataToPartialTask(formData)).toThrow('Please select a valid priority');
    });

    it('should throw error for empty title', () => {
      const formData = new FormData();
      formData.set('title', '   ');
      formData.set('description', 'Test Description');
      formData.set('status', 'todo');
      formData.set('priority', 'high');

      expect(() => formDataToPartialTask(formData)).toThrow('Please enter a task title');
    });

    it('should throw error for empty description', () => {
      const formData = new FormData();
      formData.set('title', 'Test Task');
      formData.set('description', '   ');
      formData.set('status', 'todo');
      formData.set('priority', 'high');

      expect(() => formDataToPartialTask(formData)).toThrow('Please enter a task description');
    });

    it('should trim whitespace from title and description', () => {
      const formData = new FormData();
      formData.set('title', '  Test Task  ');
      formData.set('description', '  Test Description  ');
      formData.set('status', 'todo');
      formData.set('priority', 'high');

      const partial = formDataToPartialTask(formData);

      expect(partial.title).toBe('Test Task');
      expect(partial.description).toBe('Test Description');
    });
  });
});
