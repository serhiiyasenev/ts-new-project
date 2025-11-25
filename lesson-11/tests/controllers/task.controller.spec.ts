import { describe, it, expect, vi } from 'vitest';
import { TaskController } from '../../src/controllers/TaskController';
import * as taskService from '../../src/services/tasks';
import { ApiError } from '../../src/types/errors';

describe('TaskController (unit)', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('getAllTasks returns mapped dtos', async () => {
    const now = new Date();
    const mockTasks: any[] = [{ id: 2, title: 'T', status: 'todo', priority: 'low', createdAt: now, updatedAt: now }];
    vi.spyOn(taskService, 'getAllTasks').mockResolvedValue(mockTasks as any);

    const ctrl = new TaskController();
    const res = await ctrl.getAllTasks(undefined, undefined, undefined, undefined);
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].id).toBe(2);
  });

  it('getTaskById throws 404 when not found', async () => {
    vi.spyOn(taskService, 'getTaskById').mockResolvedValue(null as any);
    const ctrl = new TaskController();
    await expect(ctrl.getTaskById('1')).rejects.toBeInstanceOf(ApiError);
  });

  it('createTask sets status 201', async () => {
    const now = new Date();
    const created = { id: 7, title: 'New', status: 'todo', priority: 'low', createdAt: now, updatedAt: now } as any;
    vi.spyOn(taskService, 'createTask').mockResolvedValue(created);
    const ctrl = new TaskController();
    const res = await ctrl.createTask({ title: 'New' } as any);
    expect(res.id).toBe(7);
  });

  it('updateTask throws when not found', async () => {
    vi.spyOn(taskService, 'updateTask').mockResolvedValue(null as any);
    const ctrl = new TaskController();
    await expect(ctrl.updateTask('9', { title: 'x' } as any)).rejects.toBeInstanceOf(ApiError);
  });

  it('deleteTask throws 404 when not found', async () => {
    vi.spyOn(taskService, 'deleteTask').mockResolvedValue(false);
    const ctrl = new TaskController();
    await expect(ctrl.deleteTask('999')).rejects.toBeInstanceOf(ApiError);
  });
});
