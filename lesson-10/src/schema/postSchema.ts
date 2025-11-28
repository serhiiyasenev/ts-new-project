import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  userId: z.number().int().positive(),
});

export type PostFormFields = z.infer<typeof postSchema>;
