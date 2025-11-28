import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../src/api/usersApi";

describe("usersApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch all users", async () => {
    const mockUsers = [{ id: 1, name: "User 1" }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUsers,
      })
    );

    const result = await fetchUsers();
    expect(result).toEqual(mockUsers);
  });

  it("should fetch user by id", async () => {
    const mockUser = { id: 1, name: "User 1" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      })
    );

    const result = await fetchUserById(1);
    expect(result).toEqual(mockUser);
  });

  it("should create a user", async () => {
    const newUser = {
      name: "New User",
      email: "new@example.com",
      isActive: true,
    };
    const createdUser = {
      id: 1,
      ...newUser,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      lastLoginAt: null,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => createdUser,
      })
    );

    const result = await createUser(newUser);
    expect(result).toEqual(createdUser);
  });

  it("should update a user", async () => {
    const updateData = { name: "Updated User" };
    const updatedUser = {
      id: 1,
      name: "Updated User",
      email: "user@example.com",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      lastLoginAt: null,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => updatedUser,
      })
    );

    const result = await updateUser(1, updateData);
    expect(result).toEqual(updatedUser);
  });

  it("should delete a user", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      })
    );

    const result = await deleteUser(1);
    expect(result).toBeUndefined();
  });

  it("should handle error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: "User not found" }),
      })
    );

    await expect(fetchUsers()).rejects.toThrow("User not found");
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

    await expect(fetchUsers()).rejects.toThrow("Request failed");
  });

  it("should handle 204 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      })
    );

    const result = await fetchUsers();
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

    await expect(fetchUsers()).rejects.toThrow("HTTP 500");
  });
});
