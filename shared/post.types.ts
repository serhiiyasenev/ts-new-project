export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface PostQueryParams {
  title?: string;
  userId?: number;
}
