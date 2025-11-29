import { describe, it, expect } from "vitest";
import { Task, TaskStatus, TaskPriority } from "@shared/task.types";
import { User } from "@shared/user.types";
import { Post } from "@shared/post.types";

describe("Type exports", () => {
  it("should export Task types", () => {
    expect(TaskStatus).toBeDefined();
    expect(TaskStatus.Todo).toBe("todo");
    expect(TaskPriority).toBeDefined();
    expect(TaskPriority.High).toBe("high");
  });

  it("should have Task type structure", () => {
    const task: Task = {
      id: 1,
      title: "Test",
      description: "Test",
      status: TaskStatus.Todo,
      priority: TaskPriority.Medium,
      userId: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    expect(task.id).toBe(1);
  });

  it("should have User type structure", () => {
    const user: User = {
      id: 1,
      name: "Test",
      email: "test@example.com",
      isActive: true,
      lastLoginAt: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    expect(user.id).toBe(1);
  });

  it("should have Post type structure", () => {
    const post: Post = {
      id: 1,
      title: "Test",
      content: "Test content",
      userId: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    expect(post.id).toBe(1);
  });
});
