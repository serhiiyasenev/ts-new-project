import { describe, it, expect } from "vitest";
import { createMockResponse } from "./mockResponse";

describe("createMockResponse", () => {
  it("should use default json function when not provided", async () => {
    const response = createMockResponse({
      ok: true,
    });

    const result = await response.json();
    expect(result).toEqual({});
  });

  it("should use default status based on ok flag", () => {
    const successResponse = createMockResponse({ ok: true });
    expect(successResponse.status).toBe(200);

    const errorResponse = createMockResponse({ ok: false });
    expect(errorResponse.status).toBe(500);
  });

  it("should use custom headers", () => {
    const response = createMockResponse({
      ok: true,
      headers: { "content-type": "text/plain", "x-custom": "value" },
    });

    expect(response.headers.get("content-type")).toBe("text/plain");
    expect(response.headers.get("x-custom")).toBe("value");
    expect(response.headers.get("Content-Type")).toBe("text/plain"); // case-insensitive
  });

  it("should return null for missing headers", () => {
    const response = createMockResponse({ ok: true });
    expect(response.headers.get("x-missing")).toBeNull();
  });
});
