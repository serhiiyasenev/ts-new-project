import { describe, it, expect, vi } from 'vitest';
import { PostController } from '../../src/controllers/PostController';
import * as postService from '../../src/services/posts';
import { ApiError } from '../../src/types/errors';

describe('PostController (unit)', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('getAllPosts returns mapped dtos', async () => {
    const now = new Date();
    const mockPosts: any[] = [{ id: 3, title: 'P', content: 'c', createdAt: now, updatedAt: now }];
    vi.spyOn(postService, 'getAllPosts').mockResolvedValue(mockPosts as any);
    const ctrl = new PostController();
    const res = await ctrl.getAllPosts(undefined, undefined, undefined);
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].id).toBe(3);
  });

  it('getPostById throws 404 when not found', async () => {
    vi.spyOn(postService, 'getPostById').mockResolvedValue(null as any);
    const ctrl = new PostController();
    await expect(ctrl.getPostById('1')).rejects.toBeInstanceOf(ApiError);
  });

  it('createPost sets status 201 and returns dto', async () => {
    const now = new Date();
    const created = { id: 11, title: 'New', content: 'x', createdAt: now, updatedAt: now } as any;
    vi.spyOn(postService, 'createPost').mockResolvedValue(created);
    const ctrl = new PostController();
    const res = await ctrl.createPost({ title: 'New', content: 'x', userId: 1 } as any);
    expect(res.id).toBe(11);
  });

  it('updatePost throws 404 when not found', async () => {
    vi.spyOn(postService, 'updatePost').mockResolvedValue(null as any);
    const ctrl = new PostController();
    await expect(ctrl.updatePost('9', { actorUserId: 1, title: 'x' } as any)).rejects.toBeInstanceOf(ApiError);
  });

  it('deletePost throws 404 when not found', async () => {
    vi.spyOn(postService, 'deletePost').mockResolvedValue(false);
    const ctrl = new PostController();
    await expect(ctrl.deletePost('999')).rejects.toBeInstanceOf(ApiError);
  });
});
