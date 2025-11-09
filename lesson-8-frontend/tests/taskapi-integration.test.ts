import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { TaskAPI } from '../src/api';
import { setupTestDom } from './helpers';
import { createSampleTask } from './helpers';
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

beforeEach(() => {
  setupTestDom();
});

afterEach(() => {
  vi.clearAllMocks();
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
