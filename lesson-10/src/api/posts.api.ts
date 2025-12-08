import { Post, CreatePostDto, UpdatePostDto, PostQueryParams } from '@shared/post.types'
import { get, post, put, del } from './client'

export async function fetchPosts(params?: PostQueryParams): Promise<Post[]> {
  return get<Post[]>('/posts', params as Record<string, string | number | boolean | undefined>)
}

export async function fetchPostById(id: number): Promise<Post> {
  return get<Post>(`/posts/${id}`)
}

export async function createPost(data: CreatePostDto): Promise<Post> {
  return post<Post, CreatePostDto>('/posts', data)
}

export async function updatePost(id: number, data: UpdatePostDto): Promise<Post> {
  return put<Post, UpdatePostDto>(`/posts/${id}`, data)
}

export async function deletePost(id: number): Promise<void> {
  return del<void>(`/posts/${id}`)
}
