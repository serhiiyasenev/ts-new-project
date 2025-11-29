import { describe, it, expect, vi, beforeEach } from "vitest";
import { get, post, put, del } from "../../src/api/client";
import { createMockResponse } from "../helpers/mockResponse";

describe("API Client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Error handling", () => {
    it("should throw error with statusText when no JSON error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          createMockResponse({
            ok: false,
            status: 500,
            json: async () => {
              throw new Error("Not JSON");
            },
            headers: { "content-type": "text/html" },
          })
        )
      );

      await expect(get("/api/test")).rejects.toThrow("HTTP 500");
    });

    it("should throw error for non-JSON response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          createMockResponse({
            ok: true,
            status: 200,
            json: async () => ({ data: "test" }),
            headers: { "content-type": "text/plain" },
          })
        )
      );

      await expect(get("/api/test")).rejects.toThrow("Expected JSON response");
    });

    it("should handle standardized API error response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          createMockResponse({
            ok: true,
            status: 200,
            json: async () => ({
              success: false,
              message: "Custom error",
              code: 400,
            }),
          })
        )
      );

      await expect(get("/api/test")).rejects.toThrow("Custom error");
    });

    it("should handle standardized API success response", async () => {
      const mockData = { id: 1, name: "Test" };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          createMockResponse({
            ok: true,
            status: 200,
            json: async () => ({
              success: true,
              data: mockData,
            }),
          })
        )
      );

      const result = await get("/api/test");
      expect(result).toEqual(mockData);
    });
  });

  describe("HTTP methods", () => {
    it("should make GET request with undefined params", async () => {
      const mockData = { id: 1 };
      const fetchMock = vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockData,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      await get("/api/test", { key1: "value", key2: undefined });
      const calledUrl = fetchMock.mock.calls[0][0];
      expect(calledUrl).toContain("key1=value");
      expect(calledUrl).not.toContain("key2");
    });

    it("should make POST request", async () => {
      const mockData = { id: 1 };
      const fetchMock = vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockData,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      await post("/api/test", { name: "test" });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "POST" })
      );
    });

    it("should make POST request without data", async () => {
      const mockData = { id: 1 };
      const fetchMock = vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockData,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      await post("/api/test");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: undefined,
        })
      );
    });

    it("should make PUT request", async () => {
      const mockData = { id: 1 };
      const fetchMock = vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          json: async () => mockData,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      await put("/api/test/1", { name: "updated" });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "PUT" })
      );
    });

    it("should make DELETE request", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        createMockResponse({
          ok: true,
          status: 204,
        })
      );
      vi.stubGlobal("fetch", fetchMock);

      await del("/api/test/1");
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });
});
