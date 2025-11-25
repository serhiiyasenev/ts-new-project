import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Email must be valid"),
  isActive: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.partial();

const isActiveStringSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((val) => val === "true" || val === "false", {
    message: "isActive must be true or false",
  })
  .transform((val) => val === "true");

const isActiveQuerySchema = z.union([z.boolean(), isActiveStringSchema]);

export const queryUsersSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  isActive: isActiveQuerySchema.optional()
});
