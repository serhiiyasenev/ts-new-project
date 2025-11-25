import { z } from "zod";

export type UserFilters = {
  name?: string;
  email?: string;
};

export interface CreateUserDto {
  name: string;
  email: string;
  isActive?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  email: z.string().email("Email must be valid"),
  isActive: z.boolean().optional()
});

export const updateUserSchema = createUserSchema.partial();

export const queryUsersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional()
});
