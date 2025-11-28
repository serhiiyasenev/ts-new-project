import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  fetchTasksGrouped,
} from "../../src/api/tasksApi";

describe("tasksApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch all tasks", async () => {
    const mockTasks = [{ id: 1, title: "Task 1" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTasks,
      })
    );

    const result = await fetchTasks();
    expect(result).toEqual(mockTasks);
  });

  it("should fetch task by id", async () => {
    const mockTask = { id: 1, title: "Task 1" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTask,
      })
    );

    const result = await fetchTaskById(1);
    expect(result).toEqual(mockTask);
  });

  it("should create a task", async () => {
    const newTask = {
      title: "New Task",
      status: "todo" as const,
      priority: "medium" as const,
    };
    const createdTask = {
      id: 1,
      ...newTask,
      description: "",
      userId: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => createdTask,
      })
    );

    const result = await createTask(newTask);
    expect(result).toEqual(createdTask);
  });

  it("should update a task", async () => {
    const updateData = { title: "Updated Task" };
    const updatedTask = {
      id: 1,
      title: "Updated Task",
      status: "todo" as const,
      priority: "medium" as const,
      description: "",
      userId: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => updatedTask,
      })
    );

    const result = await updateTask(1, updateData);
    expect(result).toEqual(updatedTask);
  });

  it("should delete a task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      })
    );

    const result = await deleteTask(1);
    expect(result).toBeUndefined();
  });

  it("should handle error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: "Task not found" }),
      })
    );

    await expect(fetchTasks()).rejects.toThrow("Task not found");
  });

  it("should handle error without json", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      })
    );

    await expect(fetchTasks()).rejects.toThrow("Request failed");
  });

  it("should handle 204 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      })
    );

    const result = await fetchTasks();
    expect(result).toBeUndefined();
  });

  it("should handle error with empty message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: "" }),
      })
    );

    await expect(fetchTasks()).rejects.toThrow("HTTP 500");
  });

  it("should fetch tasks grouped by status", async () => {
    const mockGroupedTasks = {
      todo: [
        {
          id: 1,
          title: "Todo Task",
          status: "todo" as const,
          priority: "medium" as const,
          description: "",
          userId: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
      in_progress: [
        {
          id: 2,
          title: "In Progress Task",
          status: "in_progress" as const,
          priority: "high" as const,
          description: "",
          userId: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
      done: [
        {
          id: 3,
          title: "Done Task",
          status: "done" as const,
          priority: "low" as const,
          description: "",
          userId: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockGroupedTasks,
      })
    );

    const result = await fetchTasksGrouped();
    expect(result).toEqual(mockGroupedTasks);
    expect(result.todo).toHaveLength(1);
    expect(result.in_progress).toHaveLength(1);
    expect(result.done).toHaveLength(1);
  });
});
