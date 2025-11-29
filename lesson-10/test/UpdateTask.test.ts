import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskStatus, TaskPriority } from "../src/types";
import { createMockResponse } from "./helpers/mockResponse";
import { updateTask } from "../src/api/tasks.api";

describe("updateTask API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends PUT request and returns updated task", async () => {
    const mockResp = {
      id: 12,
      title: "Updated Task",
      description: "Updated",
      status: TaskStatus.InProgress,
      priority: TaskPriority.High,
      userId: null,
      createdAt: "2025-11-20",
      updatedAt: "2025-11-20",
    };
    const fetchMockFn = vi.fn(() =>
      Promise.resolve(
        createMockResponse({ ok: true, json: async () => mockResp })
      )
    );
    vi.stubGlobal("fetch", fetchMockFn as unknown as typeof globalThis.fetch);

    const result = await updateTask(12, { title: "Updated Task" });

    expect(fetchMockFn).toHaveBeenCalledWith(
      "/api/tasks/12",
      expect.objectContaining({ method: "PUT" })
    );
    expect(result).toEqual(mockResp);
  });
});
