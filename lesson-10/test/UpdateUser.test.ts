import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockResponse } from "./helpers/mockResponse";
import { updateUser } from "../src/api/users.api";

describe("updateUser API", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends PUT request and returns updated user", async () => {
    const mockResp = {
      id: 1,
      name: "Updated User",
      email: "upd@example.com",
      isActive: true,
      lastLoginAt: null,
      createdAt: "2025-11-20",
      updatedAt: "2025-11-20",
    };
    const fetchMockFn = vi.fn(() =>
      Promise.resolve(
        createMockResponse({ ok: true, json: async () => mockResp })
      )
    );
    vi.stubGlobal("fetch", fetchMockFn as unknown as typeof globalThis.fetch);

    const result = await updateUser(1, { name: "Updated User" });

    expect(fetchMockFn).toHaveBeenCalledWith(
      "/api/users/1",
      expect.objectContaining({ method: "PUT" })
    );
    expect(result).toEqual(mockResp);
  });
});
