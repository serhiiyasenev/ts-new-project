import { describe, it, expect, beforeEach } from 'vitest';
import { setupTestDom } from './helpers';
import { createSampleTask } from './helpers';
import { 
  updateTotalTasks, 
  updateStatusCounts, 
  updatePriorityCounts, 
  updateUpcomingDeadlines,
  MAX_UPCOMING_DEADLINES,
  MAX_DEADLINE_TITLE_LENGTH 
} from '../src/stats';
import type { Task } from '../src/types';

beforeEach(() => {
  setupTestDom();
});

describe('Statistics Functions', () => {
  describe('updateTotalTasks', () => {
    it('should update total tasks count', () => {
      updateTotalTasks(5);
      const element = document.querySelector('#totalTasks');
      expect(element?.textContent).toBe('5');
    });

    it('should handle zero tasks', () => {
      updateTotalTasks(0);
      const element = document.querySelector('#totalTasks');
      expect(element?.textContent).toBe('0');
    });

    it('should update with large numbers', () => {
      updateTotalTasks(9999);
      const element = document.querySelector('#totalTasks');
      expect(element?.textContent).toBe('9999');
    });
  });

  describe('updateStatusCounts', () => {
    it('should count tasks by status correctly', () => {
      const tasks: Task[] = [
        createSampleTask({ id: '1', status: 'todo' }),
        createSampleTask({ id: '2', status: 'todo' }),
        createSampleTask({ id: '3', status: 'in_progress' }),
        createSampleTask({ id: '4', status: 'done' }),
        createSampleTask({ id: '5', status: 'done' }),
        createSampleTask({ id: '6', status: 'done' }),
      ];

      updateStatusCounts(tasks);

      expect(document.querySelector('#todoCount')?.textContent).toBe('2');
      expect(document.querySelector('#inProgressCount')?.textContent).toBe('1');
      expect(document.querySelector('#doneCount')?.textContent).toBe('3');
    });

    it('should handle empty task list', () => {
      updateStatusCounts([]);

      expect(document.querySelector('#todoCount')?.textContent).toBe('0');
      expect(document.querySelector('#inProgressCount')?.textContent).toBe('0');
      expect(document.querySelector('#doneCount')?.textContent).toBe('0');
    });
  });

  describe('updatePriorityCounts', () => {
    it('should count tasks by priority correctly', () => {
      const tasks: Task[] = [
        createSampleTask({ id: '1', priority: 'low' }),
        createSampleTask({ id: '2', priority: 'low' }),
        createSampleTask({ id: '3', priority: 'medium' }),
        createSampleTask({ id: '4', priority: 'high' }),
        createSampleTask({ id: '5', priority: 'high' }),
        createSampleTask({ id: '6', priority: 'high' }),
      ];

      updatePriorityCounts(tasks);

      expect(document.querySelector('#lowPriorityCount')?.textContent).toBe('2');
      expect(document.querySelector('#mediumPriorityCount')?.textContent).toBe('1');
      expect(document.querySelector('#highPriorityCount')?.textContent).toBe('3');
    });

    it('should handle empty task list', () => {
      updatePriorityCounts([]);

      expect(document.querySelector('#lowPriorityCount')?.textContent).toBe('0');
      expect(document.querySelector('#mediumPriorityCount')?.textContent).toBe('0');
      expect(document.querySelector('#highPriorityCount')?.textContent).toBe('0');
    });
  });

  describe('updateUpcomingDeadlines', () => {
    it('should display upcoming deadlines sorted by date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const tasks: Task[] = [
        createSampleTask({ id: '1', title: 'Task 1', deadline: nextWeek }),
        createSampleTask({ id: '2', title: 'Task 2', deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.children.length).toBe(2);
      expect(container?.children[0].textContent).toContain('Task 2');
      expect(container?.children[1].textContent).toContain('Task 1');
    });

    it(`should display max ${MAX_UPCOMING_DEADLINES} upcoming deadlines`, () => {
      const tasks: Task[] = Array.from({ length: 10 }, (_, i) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + i + 1);
        return createSampleTask({ id: `${i}`, deadline });
      });

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.children.length).toBe(MAX_UPCOMING_DEADLINES);
    });

    it('should ignore past deadlines', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks: Task[] = [
        createSampleTask({ id: '1', deadline: yesterday }),
        createSampleTask({ id: '2', deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.children.length).toBe(1);
    });

    it('should display message when no upcoming deadlines', () => {
      updateUpcomingDeadlines([]);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.textContent).toContain('No upcoming deadlines');
    });

    it('should ignore tasks without deadlines', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks: Task[] = [
        createSampleTask({ id: '1', deadline: null }),
        createSampleTask({ id: '2', deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.children.length).toBe(1);
    });

    it(`should truncate long task titles to ${MAX_DEADLINE_TITLE_LENGTH} characters`, () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const longTitle = 'This is a very long task title that should be truncated';
      const tasks: Task[] = [
        createSampleTask({ id: '1', title: longTitle, deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      const label = container?.querySelector('.stat-label');
      // Expected: first MAX_DEADLINE_TITLE_LENGTH chars + '...'
      const expectedText = longTitle.slice(0, MAX_DEADLINE_TITLE_LENGTH) + '...';
      expect(label?.textContent).toBe(expectedText);
    });
  });
});
