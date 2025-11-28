import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '../src/api/tasksApi';
import { Task } from '../src/types';

describe('tasksApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchTasks returns data on success', async () => {
    const mockTasks = [{ id: 1, title: 't', description: '', status: 'To Do', dueDate: '2025-12-01', createdAt: '2025-11-20' }];
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockTasks) }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.fetchTasks();
    expect(fetchMock).toHaveBeenCalledWith('/api/tasks');
    expect(res).toEqual(mockTasks);
  });

  it('fetchTasks throws on network error', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.fetchTasks()).rejects.toThrow('Failed to fetch tasks');
  });

  it('createTask computes new ID and posts payload with string id', async () => {
    // fetchTasks returns two tasks with numeric ids
    const existing = [{ id: 1 }, { id: 2 }];
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(existing) }) // fetchTasks
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '3', title: 'ok' }) }); // POST
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const newTask = await api.createTask({ title: 'ok', description: 'd', status: 'To Do', dueDate: '2025-12-01', createdAt: '2025-11-20' });

    // first call to /api/tasks, second call to POST /api/tasks
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const calls = (fetchMock.mock as { calls: unknown[][] }).calls;
    const postCall = calls[1] as [string, { body: string }];
    expect(postCall[0]).toEqual('/api/tasks');
    const body = JSON.parse(postCall[1].body);
    expect(typeof body.id).toBe('string');
    expect(newTask).toEqual({ id: '3', title: 'ok' });
  });

  it('createTask works when no existing tasks', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1', title: 'new' }) });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const newTask = await api.createTask({ title: 'new', description: '', status: 'To Do', dueDate: '2025-12-01', createdAt: '2025-11-20' });
    expect(newTask).toEqual({ id: '1', title: 'new' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('updateTask throws when response not ok', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.updateTask(1, { title: 'x' })).rejects.toThrow('Failed to update task');
  });

  it('createTask throws when POST fails', async () => {
    const existing: Task[] = [];
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(existing) })
      .mockResolvedValueOnce({ ok: false });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.createTask({ title: 'x', description: 'd', status: 'To Do', dueDate: '2025-12-01', createdAt: '2025-11-20' })).rejects.toThrow('Failed to create task');
  });

  it('fetchTaskById returns object on success and throws on 404', async () => {
    const mockTask = { id: 5, title: 't' } as Task;
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTask) })
      .mockResolvedValueOnce({ ok: false });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.fetchTaskById(5);
    expect(res).toEqual(mockTask);

    await expect(api.fetchTaskById(6)).rejects.toThrow('Failed to fetch task');
  });

  it('updateTask sends PUT and returns updated task', async () => {
    const mockResp = { id: 12, title: 'Updated' } as Task;
    const fetchMockFn = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResp) }));
    vi.stubGlobal('fetch', fetchMockFn as unknown as typeof globalThis.fetch);

    const res = await api.updateTask(12, { title: 'Updated' });
    expect(fetchMockFn).toHaveBeenCalledWith('/api/tasks/12', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual(mockResp);
  });
});
