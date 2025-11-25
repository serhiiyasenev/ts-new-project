import { z } from "zod";

export type PostFilters = {
  title?: string;
  content?: string;
  userId?: number;
};

export interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  userId: z.number().int().positive()
});

export const updatePostSchema = createPostSchema.partial();

export const queryPostsSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  userId: z.string().regex(/^\d+$/, "userId must be numeric").optional()
});
