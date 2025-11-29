/**
 * Tasks API Client
 * Type-safe API methods for task operations
 */

import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TasksGroupedByStatus,
  TaskQueryParams,
} from "@shared/task.types";
import { get, post, put, del } from "./client";

export type TasksByStatus = TasksGroupedByStatus;

/**
 * Fetch all tasks with optional filters
 */
export async function fetchTasks(
  params?: Omit<TaskQueryParams, "groupBy">
): Promise<Task[]> {
  return get<Task[]>(
    "/tasks",
    params as Record<string, string | number | boolean | undefined>
  );
}

/**
 * Fetch tasks grouped by status for Kanban board
 */
export async function fetchTasksGrouped(
  params?: Omit<TaskQueryParams, "groupBy">
): Promise<TasksGroupedByStatus> {
  // Convert arrays to comma-separated strings for query params
  const queryParams: Record<string, string | number | boolean | undefined> = {
    groupBy: "status",
  };

  if (params) {
    if (params.status) {
      queryParams.status = params.status.join(",");
    }
    if (params.priority) {
      queryParams.priority = params.priority.join(",");
    }
    if (params.title) {
      queryParams.title = params.title;
    }
    if (params.userId) {
      queryParams.userId = params.userId;
    }
    if (params.dateFrom) {
      queryParams.dateFrom = params.dateFrom;
    }
    if (params.dateTo) {
      queryParams.dateTo = params.dateTo;
    }
  }

  return get<TasksGroupedByStatus>("/tasks", queryParams);
}

/**
 * Fetch a single task by ID
 */
export async function fetchTaskById(id: number): Promise<Task> {
  return get<Task>(`/tasks/${id}`);
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskDto): Promise<Task> {
  return post<Task, CreateTaskDto>("/tasks", data);
}

/**
 * Update an existing task
 */
export async function updateTask(
  id: number,
  data: UpdateTaskDto
): Promise<Task> {
  return put<Task, UpdateTaskDto>(`/tasks/${id}`, data);
}

/**
 * Delete a task
 */
export async function deleteTask(id: number): Promise<void> {
  return del<void>(`/tasks/${id}`);
}
