/**
 * Posts API Client
 * Type-safe API methods for post operations
 */

import {
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostQueryParams,
} from "@shared/post.types";
import { get, post, put, del } from "./client";

/**
 * Fetch all posts with optional filters
 */
export async function fetchPosts(params?: PostQueryParams): Promise<Post[]> {
  return get<Post[]>(
    "/posts",
    params as Record<string, string | number | boolean | undefined>
  );
}

/**
 * Fetch a single post by ID
 */
export async function fetchPostById(id: number): Promise<Post> {
  return get<Post>(`/posts/${id}`);
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostDto): Promise<Post> {
  return post<Post, CreatePostDto>("/posts", data);
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: number,
  data: UpdatePostDto
): Promise<Post> {
  return put<Post, UpdatePostDto>(`/posts/${id}`, data);
}

/**
 * Delete a post
 */
export async function deletePost(id: number): Promise<void> {
  return del<void>(`/posts/${id}`);
}
