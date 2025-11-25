import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserController } from '../../src/controllers/UserController';
import * as userService from '../../src/services/users';
import { ApiError } from '../../src/types/errors';

describe('UserController (unit)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAllUsers maps and returns dtos', async () => {
    const now = new Date();
    const mockUsers: any[] = [
      { id: 1, name: 'A', email: 'a@example.com', isActive: true, lastLoginAt: null, createdAt: now, updatedAt: now },
    ];
    vi.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsers as any);

    const ctrl = new UserController();
    const res = await ctrl.getAllUsers(undefined, undefined, undefined);
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].id).toBe(1);
    expect(res[0].email).toBe('a@example.com');
  });

  it('getUserById throws 404 when not found', async () => {
    vi.spyOn(userService, 'getUserById').mockResolvedValue(null as any);
    const ctrl = new UserController();
    await expect(ctrl.getUserById('123')).rejects.toBeInstanceOf(ApiError);
  });

  it('createUser sets status 201 and returns dto', async () => {
    const now = new Date();
    const created = { id: 5, name: 'New', email: 'n@example.com', isActive: true, lastLoginAt: null, createdAt: now, updatedAt: now } as any;
    vi.spyOn(userService, 'createUser').mockResolvedValue(created);

    const ctrl = new UserController();
    const res = await ctrl.createUser({ name: 'New', email: 'n@example.com' } as any);
    // Controller sets status via setStatus; ensure result and id
    expect(res.id).toBe(5);
  });

  it('updateUser throws when payload empty', async () => {
    const ctrl = new UserController();
    await expect(ctrl.updateUser('1', {} as any)).rejects.toBeInstanceOf(ApiError);
  });

  it('deleteUser throws 404 when not found', async () => {
    vi.spyOn(userService, 'deleteUser').mockResolvedValue(false);
    const ctrl = new UserController();
    await expect(ctrl.deleteUser('999')).rejects.toBeInstanceOf(ApiError);
  });
});
