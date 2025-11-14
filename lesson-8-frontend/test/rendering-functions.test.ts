import { describe, it, expect, beforeEach } from 'vitest';
import { capitalize, createTaskHeader, createTaskMeta } from '../src/dom-utils';
import { setupTestDom } from './helpers/helpers';
import { createSampleTask } from './helpers/helpers';

beforeEach(() => {
  setupTestDom();
});

describe('Rendering Functions', () => {
  describe('createTaskHeader', () => {
    it('should create task header with title and priority', () => {
      const task = createSampleTask({ title: 'Test Task', priority: 'high' });
      const header = createTaskHeader(task);

      expect(header.className).toBe('task-header');
      expect(header.querySelector('h3')?.textContent).toBe('Test Task');
      expect(header.querySelector('.badge')?.textContent).toBe('High');
      expect(header.querySelector('.badge')?.classList.contains('priority-high')).toBe(true);
    });

    it('should handle different priorities', () => {
      const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      
      priorities.forEach(priority => {
        const task = createSampleTask({ priority });
        const header = createTaskHeader(task);
        const badge = header.querySelector('.badge');
        
        expect(badge?.textContent).toBe(capitalize(priority));
        expect(badge?.classList.contains(`priority-${priority}`)).toBe(true);
      });
    });
  });

  describe('createTaskMeta', () => {
    it('should create task meta with created date', () => {
      const task = createSampleTask({ createdAt: new Date('2024-01-15') });
      const meta = createTaskMeta(task);

      expect(meta.className).toBe('task-meta');
      expect(meta.textContent).toContain('Created:');
      expect(meta.textContent).toContain('1/15/2024');
    });

    it('should include deadline when present', () => {
      const task = createSampleTask({
        createdAt: new Date('2024-01-15'),
        deadline: new Date('2024-12-31'),
      });
      const meta = createTaskMeta(task);

      expect(meta.textContent).toContain('Created:');
      expect(meta.textContent).toContain('Deadline:');
      expect(meta.textContent).toContain('12/31/2024');
    });

    it('should not include deadline when null', () => {
      const task = createSampleTask({ deadline: null });
      const meta = createTaskMeta(task);

      expect(meta.textContent).toContain('Created:');
      expect(meta.textContent).not.toContain('Deadline:');
    });
  });
});
