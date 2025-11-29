import { describe, it, expect, beforeEach, vi } from "vitest";
import { TaskStatus, TaskPriority } from "../../src/types";
import { createMockResponse } from "../helpers/mockResponse";
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  fetchTasksGrouped,
} from "../../src/api/tasks.api";

describe("tasksApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch all tasks", async () => {
    const mockTasks = [{ id: 1, title: "Task 1" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockTasks,
        })
      )
    );

    const result = await fetchTasks();
    expect(result).toEqual(mockTasks);
  });

  it("should fetch tasks with query parameters", async () => {
    const mockTasks = [{ id: 1, title: "Task 1" }];
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: true,
        json: async () => mockTasks,
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchTasks({
      status: [TaskStatus.Todo, TaskStatus.InProgress],
      priority: [TaskPriority.High],
      title: "test",
      userId: 1,
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    });

    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("status=todo%2Cin_progress");
    expect(calledUrl).toContain("priority=high");
    expect(calledUrl).toContain("title=test");
    expect(calledUrl).toContain("userId=1");
    expect(calledUrl).toContain("dateFrom=2024-01-01");
    expect(calledUrl).toContain("dateTo=2024-12-31");
  });

  it("should fetch task by id", async () => {
    const mockTask = { id: 1, title: "Task 1" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockTask,
        })
      )
    );

    const result = await fetchTaskById(1);
    expect(result).toEqual(mockTask);
  });

  it("should create a task", async () => {
    const newTask = {
      title: "New Task",
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
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
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => createdTask,
        })
      )
    );

    const result = await createTask(newTask);
    expect(result).toEqual(createdTask);
  });

  it("should update a task", async () => {
    const updateData = { title: "Updated Task" };
    const updatedTask = {
      id: 1,
      title: "Updated Task",
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      description: "",
      userId: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => updatedTask,
        })
      )
    );

    const result = await updateTask(1, updateData);
    expect(result).toEqual(updatedTask);
  });

  it("should delete a task", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          status: 204,
        })
      )
    );

    const result = await deleteTask(1);
    expect(result).toBeUndefined();
  });

  it("should handle error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: false,
          status: 404,
          json: async () => ({ message: "Task not found" }),
        })
      )
    );

    await expect(fetchTasks()).rejects.toThrow("Task not found");
  });

  it("should handle error without json", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: false,
          status: 500,
          json: async () => {
            throw new Error("Invalid JSON");
          },
        })
      )
    );

    await expect(fetchTasks()).rejects.toThrow("Invalid JSON");
  });

  it("should handle 204 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          status: 204,
        })
      )
    );

    const result = await fetchTasks();
    expect(result).toBeUndefined();
  });

  it("should handle error with empty message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: false,
          status: 500,
          json: async () => ({ message: "" }),
        })
      )
    );

    await expect(fetchTasks()).rejects.toThrow("HTTP 500");
  });

  it("should fetch tasks grouped by status", async () => {
    const mockGroupedTasks = {
      todo: [
        {
          id: 1,
          title: "Todo Task",
          status: TaskStatus.Todo,
          priority: TaskPriority.Medium,
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
          status: TaskStatus.InProgress,
          priority: TaskPriority.High,
          description: "",
          userId: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
      review: [],
      done: [
        {
          id: 3,
          title: "Done Task",
          status: TaskStatus.Done,
          priority: TaskPriority.Low,
          description: "",
          userId: null,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ],
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockGroupedTasks,
        })
      )
    );

    const result = await fetchTasksGrouped();
    expect(result).toEqual(mockGroupedTasks);
    expect(result.todo).toHaveLength(1);
    expect(result.in_progress).toHaveLength(1);
    expect(result.done).toHaveLength(1);
  });

  it("should fetch tasks grouped by status with query parameters", async () => {
    const mockGroupedTasks = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: true,
        json: async () => mockGroupedTasks,
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchTasksGrouped({
      status: [TaskStatus.Todo],
      priority: [TaskPriority.High],
      title: "test",
      userId: 1,
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    });

    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("groupBy=status");
    expect(calledUrl).toContain("status=todo");
    expect(calledUrl).toContain("priority=high");
    expect(calledUrl).toContain("title=test");
    expect(calledUrl).toContain("userId=1");
    expect(calledUrl).toContain("dateFrom=2024-01-01");
    expect(calledUrl).toContain("dateTo=2024-12-31");
  });

  it("should fetch tasks grouped by status with partial parameters", async () => {
    const mockGroupedTasks = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: true,
        json: async () => mockGroupedTasks,
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    // Test with only some parameters to cover all branches
    await fetchTasksGrouped({
      status: undefined,
      priority: undefined,
      title: undefined,
      userId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    });

    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("groupBy=status");
    expect(calledUrl).not.toContain("status=");
    expect(calledUrl).not.toContain("priority=");
    expect(calledUrl).not.toContain("title=");
    expect(calledUrl).not.toContain("userId=");
    expect(calledUrl).not.toContain("dateFrom=");
    expect(calledUrl).not.toContain("dateTo=");
  });
});
