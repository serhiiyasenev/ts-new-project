import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import type { Task } from '../src/types';
import { sortTasksByCreatedDate } from '../src/main';
import { capitalize, createTaskHeader, createTaskMeta } from '../src/dom-utils';
import { updateTotalTasks, updateStatusCounts, updatePriorityCounts, updateUpcomingDeadlines } from '../src/stats';
import { formDataToTask, formDataToPartialTask } from '../src/form-utils';
import { setupTestDom } from '../src/setupTestDom';

// Mock the API module
vi.mock('../src/api', () => ({
  TaskAPI: {
    getAllTasks: vi.fn(),
    getTaskById: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

// Import after mocking
import { TaskAPI } from '../src/api';

// Helper function to create a sample task
function createSampleTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-01-01'),
    deadline: null,
    ...overrides,
  };
}

beforeEach(() => {
  setupTestDom();
});

afterEach(() => {
  vi.clearAllMocks();
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
  });
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

    it('should display max 5 upcoming deadlines', () => {
      const tasks: Task[] = Array.from({ length: 10 }, (_, i) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + i + 1);
        return createSampleTask({ id: `${i}`, deadline });
      });

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      expect(container?.children.length).toBe(3);
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

    it('should truncate long task titles to 20 characters', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const longTitle = 'This is a very long task title that should be truncated';
      const tasks: Task[] = [
        createSampleTask({ id: '1', title: longTitle, deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const container = document.querySelector('#upcomingDeadlines');
      const label = container?.querySelector('.stat-label');
      expect(label?.textContent).toBe('This is a very long...');
    });
  });
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

describe('TaskAPI Integration', () => {
  it('should call getAllTasks', async () => {
    const mockTasks: Task[] = [createSampleTask()];
    (TaskAPI.getAllTasks as Mock).mockResolvedValue(mockTasks);

    const tasks = await TaskAPI.getAllTasks();

    expect(TaskAPI.getAllTasks).toHaveBeenCalled();
    expect(tasks).toEqual(mockTasks);
  });

  it('should call getTaskById', async () => {
    const mockTask = createSampleTask({ id: '123' });
    (TaskAPI.getTaskById as Mock).mockResolvedValue(mockTask);

    const task = await TaskAPI.getTaskById('123');

    expect(TaskAPI.getTaskById).toHaveBeenCalledWith('123');
    expect(task).toEqual(mockTask);
  });

  it('should call createTask', async () => {
    const newTask = createSampleTask();
    (TaskAPI.createTask as Mock).mockResolvedValue(newTask);

    const task = await TaskAPI.createTask(newTask);

    expect(TaskAPI.createTask).toHaveBeenCalledWith(newTask);
    expect(task).toEqual(newTask);
  });

  it('should call updateTask', async () => {
    const updatedTask = createSampleTask({ id: '123', title: 'Updated' });
    (TaskAPI.updateTask as Mock).mockResolvedValue(updatedTask);

    const task = await TaskAPI.updateTask('123', { title: 'Updated' });

    expect(TaskAPI.updateTask).toHaveBeenCalledWith('123', { title: 'Updated' });
    expect(task).toEqual(updatedTask);
  });

  it('should call deleteTask', async () => {
    (TaskAPI.deleteTask as Mock).mockResolvedValue(undefined);

    await TaskAPI.deleteTask('123');

    expect(TaskAPI.deleteTask).toHaveBeenCalledWith('123');
  });

  it('setupTestDom should render minimal DOM correctly', () => {
  setupTestDom();
  expect(document.querySelector('#taskForm')).not.toBeNull();
  expect(document.querySelector('#upcomingDeadlines')).not.toBeNull();
  });
});
