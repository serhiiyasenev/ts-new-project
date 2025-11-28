import type { Task, CreateTaskData, UpdateTaskData } from "../types";

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

export interface TasksByStatus {
  todo: Task[];
  in_progress: Task[];
  review: Task[];
  done: Task[];
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_BASE}/tasks`);
  return handleResponse<Task[]>(response);
};

export const fetchTasksGrouped = async (): Promise<TasksByStatus> => {
  const response = await fetch(`${API_BASE}/tasks?groupBy=status`);
  return handleResponse<TasksByStatus>(response);
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks/${id}`);
  return handleResponse<Task>(response);
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
};

export const updateTask = async (
  id: number,
  data: UpdateTaskData
): Promise<Task> => {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(response);
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
};
