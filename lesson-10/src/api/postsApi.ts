import type { Post, CreatePostData, UpdatePostData } from "../types";

const API_BASE = "/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
};

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE}/posts`);
  return handleResponse<Post[]>(response);
};

export const fetchPostById = async (id: number): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts/${id}`);
  return handleResponse<Post>(response);
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Post>(response);
};

export const updatePost = async (
  id: number,
  data: UpdatePostData,
  actorUserId: number
): Promise<Post> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, actorUserId }),
  });
  return handleResponse<Post>(response);
};

export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/posts/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
};
