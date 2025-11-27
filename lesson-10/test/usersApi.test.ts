import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from '../src/api/usersApi';

describe('usersApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchUsers returns list', async () => {
    const users = [{ id: '1', name: 'A', createdAt: '2025-01-01' }];
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(users) }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.fetchUsers();
    expect(fetchMock).toHaveBeenCalledWith('/api/users');
    expect(res).toEqual(users);
  });

  it('fetchUsers throws on bad response', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.fetchUsers()).rejects.toThrow('Failed to fetch users');
  });

  it('createUser posts and returns created object', async () => {
    const existing: Array<{ id: string }> = [{ id: '1' }];
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(existing) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '2', name: 'new' }) });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.createUser({ firstName: 'New', lastName: 'User', email: 'a@b.com', dateOfBirth: '1990-01-01', createdAt: '2025-01-01' });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Access the POST call arguments in a typed-safe way using unknown
    const calls = (fetchMock as ReturnType<typeof vi.fn>).mock.calls as unknown[][];
    const postOptions = calls[1][1] as Record<string, unknown>;
    const body = JSON.parse(postOptions.body as string);
    expect(typeof body.id).toBe('string');
    expect(res).toEqual({ id: '2', name: 'new' });
  });

  it('createUser works when no existing users', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1', name: 'new' }) });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.createUser({ name: 'new', email: 'a@b.com' });
    expect(res).toEqual({ id: '1', name: 'new' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('updateUser throws when response not ok', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: false }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.updateUser(1, { firstName: 'X' })).rejects.toThrow('Failed to update user');
  });

  it('createUser throws when POST fails', async () => {
    const existing: Array<{ id: string }> = [];
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(existing) })
      .mockResolvedValueOnce({ ok: false });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    await expect(api.createUser({ firstName: 'X', lastName: 'X', email: 'x@x.com', dateOfBirth: '1990-01-01', createdAt: '2025-01-01' })).rejects.toThrow('Failed to create user');
  });

  it('fetchUserById returns object and handles 404', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '5', name: 'hey' }) })
      .mockResolvedValueOnce({ ok: false });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.fetchUserById(5);
    expect(res).toEqual({ id: '5', name: 'hey' });

    await expect(api.fetchUserById(6)).rejects.toThrow('Failed to fetch user');
  });

  it('updateUser sends PUT and returns updated', async () => {
    const fetchMock = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '9', name: 'Updated' }) }));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof globalThis.fetch);

    const res = await api.updateUser(9, { firstName: 'Updated' });
    expect(fetchMock).toHaveBeenCalledWith('/api/users/9', expect.objectContaining({ method: 'PUT' }));
    expect(res).toEqual({ id: '9', name: 'Updated' });
  });
});
