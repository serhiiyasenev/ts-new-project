import { PostModel } from "../models/post.model";

export interface PostResponseDto {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export function mapPostModelToDto(model: PostModel): PostResponseDto {
  return {
    id: model.id,
    title: model.title,
    content: model.content,
    userId: model.userId,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}
