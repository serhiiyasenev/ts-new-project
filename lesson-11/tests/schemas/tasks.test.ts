import { describe, it, expect } from "vitest";
import {
  createTaskSchema,
  updateTaskSchema,
  queryTasksSchema,
  validateStatusTransition,
  statusTransitionSchema,
} from "../../src/schemas/tasks";
import { TaskStatus, TaskPriority } from "../../src/dtos/taskResponse.dto";

describe("Task Schemas", () => {
  describe("createTaskSchema", () => {
    it("should validate valid task data", () => {
      const validData = {
        title: "Test Task",
        description: "Test Description",
        status: TaskStatus.Todo,
        priority: TaskPriority.High,
        userId: 1,
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should apply default values", () => {
      const minimalData = {
        title: "Test Task",
      };

      const result = createTaskSchema.parse(minimalData);
      expect(result.status).toBe(TaskStatus.Todo);
      expect(result.priority).toBe(TaskPriority.Medium);
    });

    it("should reject empty title", () => {
      const invalidData = {
        title: "",
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject title exceeding max length", () => {
      const invalidData = {
        title: "a".repeat(256),
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject description exceeding max length", () => {
      const invalidData = {
        title: "Test",
        description: "a".repeat(5001),
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid status enum", () => {
      const invalidData = {
        title: "Test",
        status: "invalid_status",
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid priority enum", () => {
      const invalidData = {
        title: "Test",
        priority: "invalid_priority",
      };

      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept null userId", () => {
      const validData = {
        title: "Test",
        userId: null,
      };

      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from title", () => {
      const data = {
        title: "  Test Task  ",
      };

      const result = createTaskSchema.parse(data);
      expect(result.title).toBe("Test Task");
    });
  });

  describe("updateTaskSchema", () => {
    it("should allow partial updates", () => {
      const partialData = {
        title: "Updated Title",
      };

      const result = updateTaskSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it("should reject empty update object", () => {
      const emptyData = {};

      const result = updateTaskSchema.safeParse(emptyData);
      expect(result.success).toBe(false);
    });

    it("should validate individual fields", () => {
      const invalidData = {
        title: "",
      };

      const result = updateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("queryTasksSchema", () => {
    it("should parse comma-separated status values", () => {
      const query = {
        status: "todo,in_progress",
      };

      const result = queryTasksSchema.parse(query);
      expect(result.status).toEqual([TaskStatus.Todo, TaskStatus.InProgress]);
    });

    it("should parse comma-separated priority values", () => {
      const query = {
        priority: "low,high",
      };

      const result = queryTasksSchema.parse(query);
      expect(result.priority).toEqual([TaskPriority.Low, TaskPriority.High]);
    });

    it("should handle numeric userId as string", () => {
      const query = {
        userId: "123",
      };

      const result = queryTasksSchema.parse(query);
      expect(result.userId).toBe(123);
    });

    it("should reject invalid groupBy value", () => {
      const query = {
        groupBy: "invalid",
      };

      const result = queryTasksSchema.safeParse(query);
      expect(result.success).toBe(false);
    });

    it("should accept valid datetime strings", () => {
      const query = {
        dateFrom: "2024-01-01T00:00:00Z",
        dateTo: "2024-12-31T23:59:59Z",
      };

      const result = queryTasksSchema.safeParse(query);
      expect(result.success).toBe(true);
    });
  });

  describe("validateStatusTransition", () => {
    it("should allow todo -> in_progress", () => {
      expect(
        validateStatusTransition(TaskStatus.Todo, TaskStatus.InProgress),
      ).toBe(true);
    });

    it("should allow in_progress -> review", () => {
      expect(
        validateStatusTransition(TaskStatus.InProgress, TaskStatus.Review),
      ).toBe(true);
    });

    it("should allow review -> done", () => {
      expect(validateStatusTransition(TaskStatus.Review, TaskStatus.Done)).toBe(
        true,
      );
    });

    it("should allow backward transitions", () => {
      expect(
        validateStatusTransition(TaskStatus.InProgress, TaskStatus.Todo),
      ).toBe(true);
      expect(
        validateStatusTransition(TaskStatus.Review, TaskStatus.InProgress),
      ).toBe(true);
      expect(validateStatusTransition(TaskStatus.Done, TaskStatus.Review)).toBe(
        true,
      );
    });

    it("should allow all transitions for flexible Kanban board", () => {
      expect(validateStatusTransition(TaskStatus.Todo, TaskStatus.Review)).toBe(
        true,
      );
      expect(validateStatusTransition(TaskStatus.Todo, TaskStatus.Done)).toBe(
        true,
      );
      expect(
        validateStatusTransition(TaskStatus.InProgress, TaskStatus.Done),
      ).toBe(true);
    });

    it("should allow same status (no change)", () => {
      expect(validateStatusTransition(TaskStatus.Todo, TaskStatus.Todo)).toBe(
        true,
      );
      expect(validateStatusTransition(TaskStatus.Done, TaskStatus.Done)).toBe(
        true,
      );
    });
  });

  describe("statusTransitionSchema", () => {
    it("should validate valid transitions", () => {
      const result = statusTransitionSchema.safeParse({
        currentStatus: TaskStatus.Todo,
        newStatus: TaskStatus.InProgress,
      });
      expect(result.success).toBe(true);
    });

    it("should allow all transitions for flexible Kanban board", () => {
      const result = statusTransitionSchema.safeParse({
        currentStatus: TaskStatus.Todo,
        newStatus: TaskStatus.Done,
      });
      expect(result.success).toBe(true);
    });

    it("should handle all status combinations", () => {
      expect(validateStatusTransition(TaskStatus.Review, TaskStatus.Todo)).toBe(
        true,
      );
      expect(validateStatusTransition(TaskStatus.Done, TaskStatus.Todo)).toBe(
        true,
      );
      expect(
        validateStatusTransition(TaskStatus.Done, TaskStatus.InProgress),
      ).toBe(true);
    });

    it("should handle edge case with invalid status", () => {
      const invalidStatus = "invalid" as unknown as TaskStatus;
      expect(validateStatusTransition(invalidStatus, TaskStatus.Todo)).toBe(
        false,
      );
    });
  });
});
