import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUser } from '../src/api/usersApi';

describe('updateUser API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends PUT request and returns updated user', async () => {
    const mockResp = { id: 1, firstName: 'Updated', lastName: 'User', email: 'upd@example.com', dateOfBirth: '1990-01-01', createdAt: '2025-11-20' };
    const fetchMockFn = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResp) }));
    vi.stubGlobal('fetch', fetchMockFn as unknown as typeof globalThis.fetch);

    const result = await updateUser(1, { firstName: 'Updated' });

    expect(fetchMockFn).toHaveBeenCalledWith('/api/users/1', expect.objectContaining({ method: 'PUT' }));
    expect(result).toEqual(mockResp);
  });
});
