import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateTask } from '../src/api/tasksApi';

describe('updateTask API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends PUT request and returns updated task', async () => {
    const mockResp = { id: 12, title: 'Updated Task', description: 'Updated', status: 'In Progress', dueDate: '2026-01-01', createdAt: '2025-11-20' };
    const fetchMockFn = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResp) }));
    vi.stubGlobal('fetch', fetchMockFn as unknown as typeof globalThis.fetch);

    const result = await updateTask(12, { title: 'Updated Task' });

    expect(fetchMockFn).toHaveBeenCalledWith('/api/tasks/12', expect.objectContaining({ method: 'PUT' }));
    expect(result).toEqual(mockResp);
  });
});
