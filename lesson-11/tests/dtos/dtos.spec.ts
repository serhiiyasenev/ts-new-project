import { describe, it, expect } from "vitest";
import { mapPostModelToDto } from "../../src/dtos/postResponse.dto";
import { mapTaskModelToDto } from "../../src/dtos/taskResponse.dto";
import { mapUserModelToDto } from "../../src/dtos/userResponse.dto";
import { PostModel } from "../../src/models/post.model";
import { TaskModel } from "../../src/models/task.model";
import { UserModel } from "../../src/models/user.model";

describe("DTO mapping functions", () => {
  it("mapPostModelToDto converts dates to ISO strings", () => {
    const now = new Date();
    const mockModel = {
      id: 1,
      title: "T",
      content: "C",
      userId: 2,
      createdAt: now,
      updatedAt: now,
    } as unknown as PostModel;

    const dto = mapPostModelToDto(mockModel);
    expect(dto.id).toBe(1);
    expect(dto.createdAt).toBe(now.toISOString());
    expect(dto.updatedAt).toBe(now.toISOString());
  });

  it("mapTaskModelToDto maps priority/status and nullable userId", () => {
    const now = new Date();
    const mockModel = {
      id: 2,
      title: "Task",
      description: "d",
      status: "todo",
      priority: "high",
      userId: undefined,
      createdAt: now,
      updatedAt: now,
    } as unknown as TaskModel;

    const dto = mapTaskModelToDto(mockModel);
    expect(dto.userId).toBeNull();
    expect(dto.createdAt).toBe(now.toISOString());
  });

  it("mapUserModelToDto maps nested tasks/posts when present", () => {
    const now = new Date();
    const mockTask = {
      id: 3,
      title: "t",
      description: "d",
      status: "todo",
      priority: "low",
      userId: 1,
      createdAt: now,
      updatedAt: now,
    } as unknown as TaskModel;
    const mockPost = {
      id: 4,
      title: "p",
      content: "c",
      userId: 1,
      createdAt: now,
      updatedAt: now,
    } as unknown as PostModel;
    const mockModel = {
      id: 5,
      name: "U",
      email: "e@e",
      isActive: true,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      tasks: [mockTask],
      posts: [mockPost],
    } as unknown as UserModel;

    const dto = mapUserModelToDto(mockModel);
    expect(dto.tasks && dto.tasks.length).toBe(1);
    expect(dto.posts && dto.posts.length).toBe(1);
  });

  it("mapUserModelToDto handles missing relations and non-null lastLoginAt", () => {
    const now = new Date();
    const mockModel = {
      id: 6,
      name: "NoRelations",
      email: "norelations@example.com",
      isActive: false,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    } as unknown as UserModel;

    const dto = mapUserModelToDto(mockModel);
    expect(dto.lastLoginAt).toBe(now.toISOString());
    expect(dto.tasks).toBeUndefined();
    expect(dto.posts).toBeUndefined();
  });
});
