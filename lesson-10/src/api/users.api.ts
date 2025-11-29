import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
} from "@shared/user.types";
import { get, post, put, del } from "./client";

export async function fetchUsers(params?: UserQueryParams): Promise<User[]> {
  return get<User[]>(
    "/users",
    params as Record<string, string | number | boolean | undefined>
  );
}

export async function fetchUserById(id: number): Promise<User> {
  return get<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserDto): Promise<User> {
  return post<User, CreateUserDto>("/users", data);
}

export async function updateUser(
  id: number,
  data: UpdateUserDto
): Promise<User> {
  return put<User, UpdateUserDto>(`/users/${id}`, data);
}

export async function deleteUser(id: number): Promise<void> {
  return del<void>(`/users/${id}`);
}
