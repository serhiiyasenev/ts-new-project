import { describe, it, expect } from "vitest";
import { buildTaskFilter } from "../../src/services/filters/buildTaskFilter";
import { buildPostFilter } from "../../src/services/filters/buildPostFilter";
import { buildUserFilter } from "../../src/services/filters/buildUserFilter";
import { TaskPriority, TaskStatus } from "../../src/schemas/tasks";

describe("Filter Builders", () => {
  describe("buildTaskFilter", () => {
    it("builds task filter with all parameters", () => {
      const result = buildTaskFilter({
        status: [TaskStatus.Todo],
        priority: [TaskPriority.High],
        title: "test",
        userId: 1,
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      });

      expect(result).toEqual({
        status: [TaskStatus.Todo],
        priority: [TaskPriority.High],
        title: "test",
        userId: 1,
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      });
    });

    it("builds task filter with partial parameters", () => {
      const result = buildTaskFilter({
        title: "test",
      });

      expect(result).toEqual({
        status: undefined,
        priority: undefined,
        title: "test",
        userId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });
  });

  describe("buildPostFilter", () => {
    it("builds post filter with all parameters", () => {
      const result = buildPostFilter({
        title: "test",
        content: "content",
        userId: 1,
      });

      expect(result).toEqual({
        title: "test",
        content: "content",
        userId: 1,
      });
    });

    it("builds post filter with partial parameters", () => {
      const result = buildPostFilter({
        title: "test",
      });

      expect(result).toEqual({
        title: "test",
        content: undefined,
        userId: undefined,
      });
    });
  });

  describe("buildUserFilter", () => {
    it("builds user filter with all parameters", () => {
      const result = buildUserFilter({
        name: "John",
        email: "john@example.com",
        isActive: true,
      });

      expect(result).toEqual({
        name: "John",
        email: "john@example.com",
        isActive: true,
      });
    });

    it("builds user filter with partial parameters", () => {
      const result = buildUserFilter({
        name: "John",
      });

      expect(result).toEqual({
        name: "John",
        email: undefined,
        isActive: undefined,
      });
    });
  });
});
