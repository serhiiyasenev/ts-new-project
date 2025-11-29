/**
 * Users API Client
 * Type-safe API methods for user operations
 */

import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
} from "@shared/user.types";
import { get, post, put, del } from "./client";

/**
 * Fetch all users with optional filters
 */
export async function fetchUsers(params?: UserQueryParams): Promise<User[]> {
  return get<User[]>(
    "/users",
    params as Record<string, string | number | boolean | undefined>
  );
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(id: number): Promise<User> {
  return get<User>(`/users/${id}`);
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserDto): Promise<User> {
  return post<User, CreateUserDto>("/users", data);
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: number,
  data: UpdateUserDto
): Promise<User> {
  return put<User, UpdateUserDto>(`/users/${id}`, data);
}

/**
 * Delete a user
 */
export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`);
}
