import request from "supertest";
import app from "../../src/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TaskController } from "../../src/controllers/TaskController";
import * as taskService from "../../src/services/tasks";
import { ApiError } from "../../src/types/errors";
import { TaskResponseDto } from "../../src/dtos/taskResponse.dto";

describe("Tasks API (comprehensive)", () => {
  async function createUser() {
    const res = await request(app)
      .post("/users")
      .send({ name: "TaskUser", email: `taskuser${Date.now()}@example.com` })
      .expect(201);
    return res.body;
  }

  it("creates a task with defaults and returns 201", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "TaskDefaults" })
      .expect(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBeDefined();
    expect(res.body.priority).toBeDefined();

    // cleanup
    await request(app).delete(`/tasks/${res.body.id}`).expect(204);
  });

  it("creates a task with an existing user and returns userId", async () => {
    const user = await createUser();
    const res = await request(app)
      .post("/tasks")
      .send({ title: "OwnedTask", userId: user.id })
      .expect(201);
    expect(res.body.userId).toBe(user.id);

    await request(app).delete(`/tasks/${res.body.id}`).expect(204);
    await request(app).delete(`/users/${user.id}`).expect(204);
  });

  it("validates POST body and enforces user existence when provided", async () => {
    await request(app)
      .post("/tasks")
      .send({ description: "no title" })
      .expect(400);
    await request(app)
      .post("/tasks")
      .send({ title: "HasUser", userId: 9999 })
      .expect(404);
  });

  it("GET /tasks returns array and supports priority/status/title/user filters", async () => {
    const ts = Date.now();
    const title = `FilterTask${ts}`;
    const { body: created } = await request(app)
      .post("/tasks")
      .send({ title, status: "in_progress", priority: "high" })
      .expect(201);
    const { body: otherStatus } = await request(app)
      .post("/tasks")
      .send({ title: `Other${ts}`, status: "todo" })
      .expect(201);

    const byStatus = await request(app)
      .get("/tasks")
      .query({ status: "in_progress" })
      .expect(200);
    expect(
      (byStatus.body as TaskResponseDto[]).some((t) => t.id === created.id),
    ).toBe(true);

    const byPriority = await request(app)
      .get("/tasks")
      .query({ priority: "high" })
      .expect(200);
    expect(
      (byPriority.body as TaskResponseDto[]).some((t) => t.id === created.id),
    ).toBe(true);

    const byTitle = await request(app)
      .get("/tasks")
      .query({ title: title })
      .expect(200);
    expect(
      (byTitle.body as TaskResponseDto[]).some((t) => t.id === created.id),
    ).toBe(true);

    const user = await createUser();

    const assigned = await request(app)
      .put(`/tasks/${created.id}`)
      .send({ userId: user.id })
      .expect(200);
    expect(assigned.body.userId).toBe(user.id);

    const byUser = await request(app)
      .get("/tasks")
      .query({ userId: user.id.toString() })
      .expect(200);
    expect(
      (byUser.body as TaskResponseDto[]).some((t) => t.id === created.id),
    ).toBe(true);

    const multiStatus = await request(app)
      .get("/tasks")
      .query({ status: "todo,in_progress" })
      .expect(200);
    const ids = (multiStatus.body as TaskResponseDto[]).map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining([created.id, otherStatus.id]));

    // cleanup
    await request(app).delete(`/tasks/${created.id}`).expect(204);
    await request(app).delete(`/tasks/${otherStatus.id}`).expect(204);
    await request(app).delete(`/users/${user.id}`).expect(204);
  });

  it("CRUD: create -> get by id -> update -> delete", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({ title: "CRUDFlowTask", description: "desc" })
      .expect(201);
    const id = create.body.id;

    const get = await request(app).get(`/tasks/${id}`).expect(200);
    expect(get.body.id).toBe(id);

    const update = await request(app)
      .put(`/tasks/${id}`)
      .send({ title: "UpdatedTitle" })
      .expect(200);
    expect(update.body.title).toBe("UpdatedTitle");

    await request(app).delete(`/tasks/${id}`).expect(204);
    await request(app).get(`/tasks/${id}`).expect(404);
  });

  it("PUT with invalid values returns 400 when present but invalid", async () => {
    const { body: created } = await request(app)
      .post("/tasks")
      .send({ title: "ToInvalidUpdate" })
      .expect(201);
    await request(app)
      .put(`/tasks/${created.id}`)
      .send({ title: "" })
      .expect(400);
    await request(app).put(`/tasks/${created.id}`).send({}).expect(400);
    // cleanup
    await request(app).delete(`/tasks/${created.id}`).expect(204);
  });

  it("allows assigning and removing task owners while validating user existence", async () => {
    const user = await createUser();
    const { body: created } = await request(app)
      .post("/tasks")
      .send({ title: "OwnerFlow", userId: user.id })
      .expect(201);
    expect(created.userId).toBe(user.id);

    const cleared = await request(app)
      .put(`/tasks/${created.id}`)
      .send({ userId: null })
      .expect(200);
    expect(cleared.body.userId).toBe(null);

    const invalidAssign = await request(app)
      .put(`/tasks/${created.id}`)
      .send({ userId: 9999 });
    expect(invalidAssign.status).toBe(404);

    await request(app).delete(`/tasks/${created.id}`).expect(204);
    await request(app).delete(`/users/${user.id}`).expect(204);
  });

  it("requires existing users when adding ownership during update", async () => {
    const user = await createUser();
    const { body: created } = await request(app)
      .post("/tasks")
      .send({ title: "DelayedOwner" })
      .expect(201);
    await request(app)
      .put(`/tasks/${created.id}`)
      .send({ userId: user.id })
      .expect(200);

    await request(app).delete(`/tasks/${created.id}`).expect(204);
    await request(app).delete(`/users/${user.id}`).expect(204);
  });

  it("rejects invalid ids for GET/PUT/DELETE", async () => {
    await request(app).get("/tasks/xyz").expect(400);
    await request(app).put("/tasks/xyz").send({ title: "Nope" }).expect(400);
    await request(app).delete("/tasks/xyz").expect(400);
  });

  it("PUT non-existent returns 404", async () => {
    await request(app).put("/tasks/999999").send({ title: "Nope" }).expect(404);
  });

  it("GET non-existent returns 404", async () => {
    await request(app).get("/tasks/999999").expect(404);
  });

  it("DELETE non-existent returns 404", async () => {
    await request(app).delete("/tasks/999999").expect(404);
  });

  describe("TaskController (unit)", () => {
    beforeEach(() => vi.restoreAllMocks());

    it("createTask throws 500 when creation fails", async () => {
      vi.spyOn(taskService, "createTask").mockResolvedValue(
        null as unknown as Awaited<ReturnType<typeof taskService.createTask>>,
      );
      const ctrl = new TaskController();
      await expect(ctrl.createTask({ title: "New" })).rejects.toBeInstanceOf(
        ApiError,
      );
    });

    it("deleteTask throws 404 when not found", async () => {
      vi.spyOn(taskService, "deleteTask").mockResolvedValue(false);
      const ctrl = new TaskController();
      await expect(ctrl.deleteTask("999")).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe("groupBy functionality", () => {
    it("returns tasks grouped by status when groupBy=status", async () => {
      // Create tasks with different statuses
      const task1 = await request(app)
        .post("/tasks")
        .send({ title: "Todo Task", status: "todo" })
        .expect(201);

      const task2 = await request(app)
        .post("/tasks")
        .send({ title: "In Progress Task", status: "in_progress" })
        .expect(201);

      const task3 = await request(app)
        .post("/tasks")
        .send({ title: "Done Task", status: "done" })
        .expect(201);

      const taskIds = [task1.body.id, task2.body.id, task3.body.id];

      // Get grouped tasks
      const res = await request(app).get("/tasks?groupBy=status").expect(200);

      expect(res.body).toHaveProperty("todo");
      expect(res.body).toHaveProperty("in_progress");
      expect(res.body).toHaveProperty("done");
      expect(Array.isArray(res.body.todo)).toBe(true);
      expect(Array.isArray(res.body.in_progress)).toBe(true);
      expect(Array.isArray(res.body.done)).toBe(true);

      // Verify our tasks are in the right groups
      const todoIds = res.body.todo.map((t: TaskResponseDto) => t.id);
      const inProgressIds = res.body.in_progress.map(
        (t: TaskResponseDto) => t.id,
      );
      const doneIds = res.body.done.map((t: TaskResponseDto) => t.id);

      expect(todoIds).toContain(task1.body.id);
      expect(inProgressIds).toContain(task2.body.id);
      expect(doneIds).toContain(task3.body.id);

      // Cleanup - delete in reverse order to avoid FK issues
      for (const id of taskIds.reverse()) {
        try {
          await request(app).delete(`/tasks/${id}`);
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    it("rejects invalid groupBy values", async () => {
      await request(app).get("/tasks?groupBy=invalid").expect(400);
    });
  });
});
