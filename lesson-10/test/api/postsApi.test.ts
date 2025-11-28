import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
} from "../../src/api/postsApi";

describe("postsApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  describe("fetchPosts", () => {
    it("should fetch all posts successfully", async () => {
      const mockPosts = [{ id: 1, title: "Test" }];
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockPosts,
        })
      );

      const result = await fetchPosts();
      expect(result).toEqual(mockPosts);
      expect(fetch).toHaveBeenCalledWith("/api/posts");
    });

    it("should handle error response with json", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ message: "Not found" }),
        })
      );

      await expect(fetchPosts()).rejects.toThrow("Not found");
    });

    it("should handle error response without json", async () => {
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

      await expect(fetchPosts()).rejects.toThrow("Request failed");
    });

    it("should handle 204 no content response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
          json: async () => ({}),
        })
      );

      const result = await fetchPosts();
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

      await expect(fetchPosts()).rejects.toThrow("HTTP 500");
    });
  });

  describe("fetchPostById", () => {
    it("should fetch post by id", async () => {
      const mockPost = { id: 1, title: "Test" };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockPost,
        })
      );

      const result = await fetchPostById(1);
      expect(result).toEqual(mockPost);
      expect(fetch).toHaveBeenCalledWith("/api/posts/1");
    });
  });

  describe("createPost", () => {
    it("should create a new post", async () => {
      const newPost = { title: "New Post", content: "Content", userId: 1 };
      const createdPost = {
        id: 1,
        ...newPost,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createdPost,
        })
      );

      const result = await createPost(newPost);
      expect(result).toEqual(createdPost);
      expect(fetch).toHaveBeenCalledWith("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
    });
  });

  describe("updatePost", () => {
    it("should update a post", async () => {
      const updateData = { title: "Updated" };
      const updatedPost = {
        id: 1,
        title: "Updated",
        content: "Content",
        userId: 1,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => updatedPost,
        })
      );

      const result = await updatePost(1, updateData, 123);
      expect(result).toEqual(updatedPost);
      expect(fetch).toHaveBeenCalledWith("/api/posts/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateData, actorUserId: 123 }),
      });
    });
  });

  describe("deletePost", () => {
    it("should delete a post", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
        })
      );

      const result = await deletePost(1);
      expect(result).toBeUndefined();
      expect(fetch).toHaveBeenCalledWith("/api/posts/1", {
        method: "DELETE",
      });
    });
  });
});
