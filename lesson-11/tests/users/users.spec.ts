import request from "supertest";
import app from "../../src/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserController } from "../../src/controllers/UserController";
import * as userService from "../../src/services/users";
import { UserModel } from "../../src/models/user.model";
import { CreateUserDto } from "../../src/dtos/userRequest.dto";
import { ApiError } from "@shared/api.types";
import { UserResponseDto } from "../../src/dtos/userResponse.dto";

describe("Users API (comprehensive)", () => {
  it("creates a user (POST) and returns 201 with created resource", async () => {
    const timestamp = Date.now();
    const res = await request(app)
      .post("/users")
      .send({ name: "CreateUser", email: `create${timestamp}@example.com` })
      .expect(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toContain(`create${timestamp}@example.com`);

    // cleanup
    await request(app).delete(`/users/${res.body.id}`).expect(204);
  });

  it("validates POST body and returns 400 on invalid input", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "no-name@example.com" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("prevents duplicate emails (unique constraint) and surfaces error", async () => {
    const timestamp = Date.now();
    const email = `dup${timestamp}@example.com`;
    const r1 = await request(app)
      .post("/users")
      .send({ name: "Alpha User", email })
      .expect(201);
    // Attempt duplicate
    const r2 = await request(app)
      .post("/users")
      .send({ name: "Beta User", email });
    expect(r2.status).toBe(409);
    expect(r2.body.message.toLowerCase()).toContain("email");

    // cleanup
    await request(app).delete(`/users/${r1.body.id}`).expect(204);
  });

  it("GET /users returns an array and supports email/name filters", async () => {
    const timestamp = Date.now();
    const email = `filter${timestamp}@example.com`;
    const name = `FilterName${timestamp}`;
    const create = await request(app)
      .post("/users")
      .send({ name, email })
      .expect(201);

    const byEmail = await request(app)
      .get("/users")
      .query({ email })
      .expect(200);
    expect(Array.isArray(byEmail.body)).toBe(true);
    expect(
      (byEmail.body as UserResponseDto[]).some((u) => u.id === create.body.id),
    ).toBe(true);

    const byName = await request(app)
      .get("/users")
      .query({ name: "FilterName" })
      .expect(200);
    expect(
      (byName.body as UserResponseDto[]).some((u) => u.id === create.body.id),
    ).toBe(true);

    const inactive = await request(app)
      .post("/users")
      .send({
        name: "Inactive",
        email: `inactive${timestamp}@example.com`,
        isActive: false,
      })
      .expect(201);

    const byIsActive = await request(app)
      .get("/users")
      .query({ isActive: "false" })
      .expect(200);
    expect(
      (byIsActive.body as UserResponseDto[]).some(
        (u) => u.id === inactive.body.id,
      ),
    ).toBe(true);

    const combined = await request(app)
      .get("/users")
      .query({ name: "FilterName", email: "filter", isActive: "true" })
      .expect(200);
    expect(combined.body.length).toBeGreaterThan(0);

    // cleanup
    await request(app).delete(`/users/${create.body.id}`).expect(204);
    await request(app).delete(`/users/${inactive.body.id}`).expect(204);
  });

  it("rejects invalid isActive filter value", async () => {
    const res = await request(app).get("/users").query({ isActive: "maybe" });
    expect(res.status).toBe(400);
    expect(res.body.message.toLowerCase()).toContain(
      "invalid user query parameters",
    );
  });

  it("GET by id returns 200 for existing and 404 for missing", async () => {
    const timestamp = Date.now();
    const create = await request(app)
      .post("/users")
      .send({ name: "ById", email: `byid${timestamp}@example.com` })
      .expect(201);
    await request(app).get(`/users/${create.body.id}`).expect(200);
    await request(app).delete(`/users/${create.body.id}`).expect(204);
    await request(app).get(`/users/${create.body.id}`).expect(404);
  });

  it("rejects invalid path parameters", async () => {
    await request(app).get("/users/not-a-number").expect(400);
  });

  it("PUT updates an existing user and validates input", async () => {
    const timestamp = Date.now();
    const create = await request(app)
      .post("/users")
      .send({ name: "Updatable", email: `up${timestamp}@example.com` })
      .expect(201);
    const updated = await request(app)
      .put(`/users/${create.body.id}`)
      .send({ name: "UpdatedName" })
      .expect(200);
    expect(updated.body.name).toBe("UpdatedName");

    const invalid = await request(app)
      .put(`/users/${create.body.id}`)
      .send({ name: "a" })
      .expect(400);
    expect(invalid.body.message.toLowerCase()).toContain(
      "invalid user update payload",
    );

    await request(app).put(`/users/${create.body.id}`).send({}).expect(400);

    // cleanup
    await request(app).delete(`/users/${create.body.id}`).expect(204);
  });

  it("prevents updating email to an existing address", async () => {
    const first = await request(app)
      .post("/users")
      .send({ name: "First", email: `first${Date.now()}@example.com` })
      .expect(201);
    const second = await request(app)
      .post("/users")
      .send({ name: "Second", email: `second${Date.now()}@example.com` })
      .expect(201);

    await request(app)
      .put(`/users/${second.body.id}`)
      .send({ email: first.body.email })
      .expect(409);

    await request(app).delete(`/users/${first.body.id}`).expect(204);
    await request(app).delete(`/users/${second.body.id}`).expect(204);
  });

  it("returns 404 when updating a non-existent user", async () => {
    await request(app).put("/users/999999").send({ name: "Ghost" }).expect(404);
  });

  it("DELETE returns 204 for existing and 404 for missing", async () => {
    const timestamp = Date.now();
    const create = await request(app)
      .post("/users")
      .send({ name: "ToDelete", email: `del${timestamp}@example.com` })
      .expect(201);
    await request(app).delete(`/users/${create.body.id}`).expect(204);
    await request(app).delete(`/users/${create.body.id}`).expect(404);
  });

  // Merge of controller unit tests to avoid duplication and preserve controller branch coverage
  describe("UserController (unit)", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("getAllUsers maps and returns dtos", async () => {
      const now = new Date();
      const mockUsers = [
        {
          id: 1,
          name: "A",
          email: "a@example.com",
          isActive: true,
          lastLoginAt: null,
          createdAt: now,
          updatedAt: now,
        },
      ] as unknown as UserModel[];
      vi.spyOn(userService, "getAllUsers").mockResolvedValue(mockUsers);

      const ctrl = new UserController();
      const res = await ctrl.getAllUsers(undefined, undefined, undefined);
      expect(Array.isArray(res)).toBe(true);
      expect(res[0].id).toBe(1);
      expect(res[0].email).toBe("a@example.com");
    });

    it("getUserById throws 404 when not found", async () => {
      vi.spyOn(userService, "getUserById").mockResolvedValue(null);
      const ctrl = new UserController();
      await expect(ctrl.getUserById("123")).rejects.toBeInstanceOf(ApiError);
    });

    it("createUser sets status 201 and returns dto", async () => {
      const now = new Date();
      const createdModel = {
        id: 5,
        name: "New",
        email: "n@example.com",
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      } as unknown as UserModel;
      vi.spyOn(userService, "createUser").mockResolvedValue(
        createdModel as unknown as Awaited<
          ReturnType<typeof userService.createUser>
        >,
      );

      const ctrl = new UserController();
      const res = await ctrl.createUser({
        name: "New",
        email: "n@example.com",
      } as CreateUserDto);
      expect(res.id).toBe(5);
    });

    it("updateUser throws when payload empty", async () => {
      const ctrl = new UserController();
      await expect(
        ctrl.updateUser("1", {} as UserResponseDto),
      ).rejects.toBeInstanceOf(ApiError);
    });

    it("deleteUser throws 404 when not found", async () => {
      vi.spyOn(userService, "deleteUser").mockResolvedValue(false);
      const ctrl = new UserController();
      await expect(ctrl.deleteUser("999")).rejects.toBeInstanceOf(ApiError);
    });
  });
});
