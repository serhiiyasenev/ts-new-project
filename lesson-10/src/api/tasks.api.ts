import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TasksGroupedByStatus,
  TaskQueryParams,
} from "@shared/task.types";
import { get, post, put, del } from "./client";

export type TasksByStatus = TasksGroupedByStatus;

export async function fetchTasks(
  params?: Omit<TaskQueryParams, "groupBy">
): Promise<Task[]> {
  return get<Task[]>(
    "/tasks",
    params as Record<string, string | number | boolean | undefined>
  );
}

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

export async function fetchTaskById(id: number): Promise<Task> {
  return get<Task>(`/tasks/${id}`);
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
  return post<Task, CreateTaskDto>("/tasks", data);
}

export async function updateTask(
  id: number,
  data: UpdateTaskDto
): Promise<Task> {
  return put<Task, UpdateTaskDto>(`/tasks/${id}`, data);
}

export async function deleteTask(id: number): Promise<void> {
  return del<void>(`/tasks/${id}`);
}
