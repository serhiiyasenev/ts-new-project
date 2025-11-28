import type { User, CreateUserData, UpdateUserData } from "../types";

const API_BASE = "/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE}/users`);
  return handleResponse<User[]>(response);
};

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/${id}`);
  return handleResponse<User>(response);
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
};

export const updateUser = async (
  id: number,
  data: UpdateUserData
): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
};
