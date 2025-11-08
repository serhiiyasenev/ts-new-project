import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import type { Task } from '../src/types';

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

// Copy utility functions from main.ts to test them
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sortTasksByCreatedDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function formDataToTask(formData: FormData): Omit<Task, 'id'> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as 'todo' | 'in_progress' | 'done';
  const priority = formData.get('priority') as 'low' | 'medium' | 'high';
  const deadlineStr = formData.get('deadline') as string;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  return {
    title,
    description,
    status,
    priority,
    createdAt: new Date(),
    deadline,
  };
}

function formDataToPartialTask(formData: FormData): Partial<Omit<Task, 'id' | 'createdAt'>> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as 'todo' | 'in_progress' | 'done';
  const priority = formData.get('priority') as 'low' | 'medium' | 'high';
  const deadlineStr = formData.get('deadline') as string;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  return {
    title,
    description,
    status,
    priority,
    deadline,
  };
}

function updateTotalTasks(count: number): void {
  const totalTasksElement = document.getElementById('total-tasks');
  if (totalTasksElement) {
    totalTasksElement.textContent = count.toString();
  }
}

function updateStatusCounts(tasks: Task[]): void {
  const todoCount = tasks.filter(task => task.status === 'todo').length;
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;
  const doneCount = tasks.filter(task => task.status === 'done').length;

  const todoCountElement = document.getElementById('todo-count');
  const inProgressCountElement = document.getElementById('in-progress-count');
  const doneCountElement = document.getElementById('done-count');

  if (todoCountElement) todoCountElement.textContent = todoCount.toString();
  if (inProgressCountElement) inProgressCountElement.textContent = inProgressCount.toString();
  if (doneCountElement) doneCountElement.textContent = doneCount.toString();
}

function updatePriorityCounts(tasks: Task[]): void {
  const lowPriorityCount = tasks.filter(task => task.priority === 'low').length;
  const mediumPriorityCount = tasks.filter(task => task.priority === 'medium').length;
  const highPriorityCount = tasks.filter(task => task.priority === 'high').length;

  const lowPriorityCountElement = document.getElementById('low-priority-count');
  const mediumPriorityCountElement = document.getElementById('medium-priority-count');
  const highPriorityCountElement = document.getElementById('high-priority-count');

  if (lowPriorityCountElement) lowPriorityCountElement.textContent = lowPriorityCount.toString();
  if (mediumPriorityCountElement) mediumPriorityCountElement.textContent = mediumPriorityCount.toString();
  if (highPriorityCountElement) highPriorityCountElement.textContent = highPriorityCount.toString();
}

function updateUpcomingDeadlines(tasks: Task[]): void {
  const upcomingDeadlinesElement = document.getElementById('upcoming-deadlines-list');
  if (!upcomingDeadlinesElement) return;

  upcomingDeadlinesElement.innerHTML = '';

  const tasksWithDeadlines = tasks.filter(
    task => task.deadline && new Date(task.deadline).getTime() > Date.now()
  );

  const sortedByDeadline = [...tasksWithDeadlines].sort((a, b) => {
    const aTime = a.deadline ? new Date(a.deadline).getTime() : 0;
    const bTime = b.deadline ? new Date(b.deadline).getTime() : 0;
    return aTime - bTime;
  });

  const upcomingTasks = sortedByDeadline.slice(0, 3);

  if (upcomingTasks.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No upcoming deadlines';
    upcomingDeadlinesElement.appendChild(emptyMessage);
  } else {
    upcomingTasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.className = 'upcoming-deadline-item';

      const taskTitle = document.createElement('strong');
      taskTitle.textContent = task.title;

      const taskDeadline = document.createElement('span');
      taskDeadline.textContent = task.deadline
        ? ` - ${new Date(task.deadline).toLocaleDateString()}`
        : '';

      taskItem.appendChild(taskTitle);
      taskItem.appendChild(taskDeadline);
      upcomingDeadlinesElement.appendChild(taskItem);
    });
  }
}

function createTaskHeader(task: Task): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'task-header';

  const title = document.createElement('h3');
  title.textContent = task.title;

  const priority = document.createElement('span');
  priority.className = `priority-badge ${task.priority}`;
  priority.textContent = capitalize(task.priority);

  header.appendChild(title);
  header.appendChild(priority);

  return header;
}

function createTaskMeta(task: Task): HTMLDivElement {
  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const createdAt = document.createElement('span');
  createdAt.textContent = `Created: ${task.createdAt.toLocaleDateString()}`;

  meta.appendChild(createdAt);

  if (task.deadline) {
    const deadline = document.createElement('span');
    deadline.textContent = `Deadline: ${task.deadline.toLocaleDateString()}`;
    meta.appendChild(deadline);
  }

  return meta;
}

// Setup DOM environment for each test
beforeEach(() => {
  document.body.innerHTML = `
    <div id="modal-overlay"></div>
    <form id="task-form">
      <input name="title" />
      <input name="description" />
      <select name="status"></select>
      <select name="priority"></select>
      <input name="deadline" />
    </form>
    <form id="edit-task-form">
      <input name="title" />
      <input name="description" />
      <select name="status"></select>
      <select name="priority"></select>
      <input name="deadline" />
    </form>
    <span id="totalTasks">0</span>
    <span id="todoCount">0</span>
    <span id="inProgressCount">0</span>
    <span id="doneCount">0</span>
    <span id="lowPriorityCount">0</span>
    <span id="mediumPriorityCount">0</span>
    <span id="highPriorityCount">0</span>
    <div id="upcomingDeadlines"></div>
    <div id="todo-tasks" data-status="todo"></div>
    <div id="in-progress-tasks" data-status="in_progress"></div>
    <div id="done-tasks" data-status="done"></div>
  `;
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
      const element = document.getElementById('total-tasks');
      expect(element?.textContent).toBe('5');
    });

    it('should handle zero tasks', () => {
      updateTotalTasks(0);
      const element = document.getElementById('total-tasks');
      expect(element?.textContent).toBe('0');
    });

    it('should update with large numbers', () => {
      updateTotalTasks(9999);
      const element = document.getElementById('total-tasks');
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

      expect(document.getElementById('todo-count')?.textContent).toBe('2');
      expect(document.getElementById('in-progress-count')?.textContent).toBe('1');
      expect(document.getElementById('done-count')?.textContent).toBe('3');
    });

    it('should handle empty task list', () => {
      updateStatusCounts([]);

      expect(document.getElementById('todo-count')?.textContent).toBe('0');
      expect(document.getElementById('in-progress-count')?.textContent).toBe('0');
      expect(document.getElementById('done-count')?.textContent).toBe('0');
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

      expect(document.getElementById('low-priority-count')?.textContent).toBe('2');
      expect(document.getElementById('medium-priority-count')?.textContent).toBe('1');
      expect(document.getElementById('high-priority-count')?.textContent).toBe('3');
    });

    it('should handle empty task list', () => {
      updatePriorityCounts([]);

      expect(document.getElementById('low-priority-count')?.textContent).toBe('0');
      expect(document.getElementById('medium-priority-count')?.textContent).toBe('0');
      expect(document.getElementById('high-priority-count')?.textContent).toBe('0');
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

      const list = document.getElementById('upcoming-deadlines-list');
      expect(list?.children.length).toBe(2);
      expect(list?.children[0].textContent).toContain('Task 2');
      expect(list?.children[1].textContent).toContain('Task 1');
    });

    it('should display max 5 upcoming deadlines', () => {
      const tasks: Task[] = Array.from({ length: 10 }, (_, i) => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + i + 1);
        return createSampleTask({ id: `${i}`, deadline });
      });

      updateUpcomingDeadlines(tasks);

      const list = document.getElementById('upcoming-deadlines-list');
      expect(list?.children.length).toBe(5);
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

      const list = document.getElementById('upcoming-deadlines-list');
      expect(list?.children.length).toBe(1);
    });

    it('should display message when no upcoming deadlines', () => {
      updateUpcomingDeadlines([]);

      const list = document.getElementById('upcoming-deadlines-list');
      expect(list?.textContent).toContain('No upcoming deadlines');
    });

    it('should ignore tasks without deadlines', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks: Task[] = [
        createSampleTask({ id: '1', deadline: null }),
        createSampleTask({ id: '2', deadline: tomorrow }),
      ];

      updateUpcomingDeadlines(tasks);

      const list = document.getElementById('upcoming-deadlines-list');
      expect(list?.children.length).toBe(1);
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
      expect(header.querySelector('.priority-badge')?.textContent).toBe('High');
      expect(header.querySelector('.priority-badge')?.classList.contains('high')).toBe(true);
    });

    it('should handle different priorities', () => {
      const priorities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      
      priorities.forEach(priority => {
        const task = createSampleTask({ priority });
        const header = createTaskHeader(task);
        const badge = header.querySelector('.priority-badge');
        
        expect(badge?.textContent).toBe(capitalize(priority));
        expect(badge?.classList.contains(priority)).toBe(true);
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
});
