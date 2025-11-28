import { z } from "zod";

const basePostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const createPostSchema = basePostSchema.extend({
  userId: z.number().int().positive(),
});

export const updatePostSchema = z.object({
  actorUserId: z.number().int().positive(),
  title: basePostSchema.shape.title.optional(),
  content: basePostSchema.shape.content.optional(),
});

export const queryPostsSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.string().trim().min(1).optional(),
  userId: z
    .union([
      z.number().int().positive(),
      z
        .string()
        .regex(/^\d+$/, "userId must be numeric")
        .transform((val) => parseInt(val, 10)),
    ])
    .optional(),
});
