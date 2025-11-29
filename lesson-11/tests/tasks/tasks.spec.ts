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
      .send({ title: "DefaultTask" })
      .expect(201);
    expect(res.body.status).toBe("todo");
    expect(res.body.priority).toBe("medium");

    await request(app).delete(`/tasks/${res.body.id}`).expect(204);
  });

  it("creates a task with review status", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Review Task", status: "review", priority: "high" })
      .expect(201);
    expect(res.body.status).toBe("review");
    expect(res.body.priority).toBe("high");
    expect(res.body.title).toBe("Review Task");

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

    // Test filtering by review status
    const reviewTask = await request(app)
      .post("/tasks")
      .send({ title: "Review Filter Test", status: "review" })
      .expect(201);

    const byReviewStatus = await request(app)
      .get("/tasks")
      .query({ status: "review" })
      .expect(200);
    expect(
      (byReviewStatus.body as TaskResponseDto[]).some(
        (t) => t.id === reviewTask.body.id,
      ),
    ).toBe(true);

    // Test multi-status filter including review
    const doneTask = await request(app)
      .post("/tasks")
      .send({ title: "Done Filter Test", status: "done" })
      .expect(201);

    const multiWithReview = await request(app)
      .get("/tasks")
      .query({ status: "in_progress,review,done" })
      .expect(200);
    const multiIds = (multiWithReview.body as TaskResponseDto[]).map(
      (t) => t.id,
    );
    expect(multiIds).toContain(created.id); // in_progress (created has in_progress status)
    expect(multiIds).toContain(reviewTask.body.id); // review
    expect(multiIds).toContain(doneTask.body.id); // done
    expect(multiIds).not.toContain(otherStatus.id); // todo should not be included

    // cleanup
    await request(app).delete(`/tasks/${created.id}`).expect(204);
    await request(app).delete(`/tasks/${otherStatus.id}`).expect(204);
    await request(app).delete(`/tasks/${reviewTask.body.id}`).expect(204);
    await request(app).delete(`/tasks/${doneTask.body.id}`).expect(204);
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

  it("CRUD with review status: create -> update -> verify", async () => {
    const create = await request(app)
      .post("/tasks")
      .send({
        title: "Review CRUD Task",
        description: "Testing review status",
        status: "review",
        priority: "high",
      })
      .expect(201);
    const id = create.body.id;

    expect(create.body.status).toBe("review");
    expect(create.body.priority).toBe("high");

    const get = await request(app).get(`/tasks/${id}`).expect(200);
    expect(get.body.status).toBe("review");
    expect(get.body.title).toBe("Review CRUD Task");

    const update = await request(app)
      .put(`/tasks/${id}`)
      .send({ description: "Updated description", priority: "low" })
      .expect(200);
    expect(update.body.description).toBe("Updated description");
    expect(update.body.priority).toBe("low");
    expect(update.body.status).toBe("review"); // Status should remain unchanged

    await request(app).delete(`/tasks/${id}`).expect(204);
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

  it("allows assigning users to review tasks", async () => {
    const user = await createUser();
    const { body: reviewTask } = await request(app)
      .post("/tasks")
      .send({ title: "Review with Owner", status: "review", userId: user.id })
      .expect(201);
    expect(reviewTask.status).toBe("review");
    expect(reviewTask.userId).toBe(user.id);

    // Update to different user
    const user2 = await createUser();
    const updated = await request(app)
      .put(`/tasks/${reviewTask.id}`)
      .send({ userId: user2.id })
      .expect(200);
    expect(updated.body.userId).toBe(user2.id);
    expect(updated.body.status).toBe("review");

    await request(app).delete(`/tasks/${reviewTask.id}`).expect(204);
    await request(app).delete(`/users/${user.id}`).expect(204);
    await request(app).delete(`/users/${user2.id}`).expect(204);
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
        .send({ title: "Review Task", status: "review" })
        .expect(201);

      const task4 = await request(app)
        .post("/tasks")
        .send({ title: "Done Task", status: "done" })
        .expect(201);

      const taskIds = [
        task1.body.id,
        task2.body.id,
        task3.body.id,
        task4.body.id,
      ];

      // Get grouped tasks
      const res = await request(app).get("/tasks?groupBy=status").expect(200);

      expect(res.body).toHaveProperty("todo");
      expect(res.body).toHaveProperty("in_progress");
      expect(res.body).toHaveProperty("review");
      expect(res.body).toHaveProperty("done");
      expect(Array.isArray(res.body.todo)).toBe(true);
      expect(Array.isArray(res.body.in_progress)).toBe(true);
      expect(Array.isArray(res.body.review)).toBe(true);
      expect(Array.isArray(res.body.done)).toBe(true);

      // Verify our tasks are in the right groups
      const todoIds = res.body.todo.map((t: TaskResponseDto) => t.id);
      const inProgressIds = res.body.in_progress.map(
        (t: TaskResponseDto) => t.id,
      );
      const reviewIds = res.body.review.map((t: TaskResponseDto) => t.id);
      const doneIds = res.body.done.map((t: TaskResponseDto) => t.id);

      expect(todoIds).toContain(task1.body.id);
      expect(inProgressIds).toContain(task2.body.id);
      expect(reviewIds).toContain(task3.body.id);
      expect(doneIds).toContain(task4.body.id);

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

  describe("date filtering", () => {
    it("filters tasks by dateFrom", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Date Filter Task" })
        .expect(201);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const res = await request(app)
        .get("/tasks")
        .query({ dateFrom: yesterday.toISOString() })
        .expect(200);

      const taskIds = (res.body as TaskResponseDto[]).map((t) => t.id);
      expect(taskIds).toContain(task.body.id);

      try {
        await request(app).delete(`/tasks/${task.body.id}`);
      } catch {
        // Ignore cleanup errors
      }
    });

    it("filters tasks by dateTo", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Date Filter Task 2" })
        .expect(201);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await request(app)
        .get("/tasks")
        .query({ dateTo: tomorrow.toISOString() })
        .expect(200);

      const taskIds = (res.body as TaskResponseDto[]).map((t) => t.id);
      expect(taskIds).toContain(task.body.id);

      try {
        await request(app).delete(`/tasks/${task.body.id}`);
      } catch {
        // Ignore cleanup errors
      }
    });

    it("filters tasks by date range (dateFrom and dateTo)", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Date Range Task" })
        .expect(201);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const res = await request(app)
        .get("/tasks")
        .query({
          dateFrom: yesterday.toISOString(),
          dateTo: tomorrow.toISOString(),
        })
        .expect(200);

      const taskIds = (res.body as TaskResponseDto[]).map((t) => t.id);
      expect(taskIds).toContain(task.body.id);

      try {
        await request(app).delete(`/tasks/${task.body.id}`);
      } catch {
        // Ignore cleanup errors
      }
    });
  });

  describe("status transition validation", () => {
    it("allows valid status transitions", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Transition Test", status: "todo" })
        .expect(201);

      const updated = await request(app)
        .put(`/tasks/${task.body.id}`)
        .send({ status: "in_progress" })
        .expect(200);

      expect(updated.body.status).toBe("in_progress");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("allows creating task with review status", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Review Task", status: "review" })
        .expect(201);

      expect(task.body.status).toBe("review");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("allows transitioning to review status", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "To Review", status: "in_progress" })
        .expect(201);

      const updated = await request(app)
        .put(`/tasks/${task.body.id}`)
        .send({ status: "review" })
        .expect(200);

      expect(updated.body.status).toBe("review");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("allows transitioning from review to done", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Review to Done", status: "review" })
        .expect(201);

      const updated = await request(app)
        .put(`/tasks/${task.body.id}`)
        .send({ status: "done" })
        .expect(200);

      expect(updated.body.status).toBe("done");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("allows all status transitions for flexible Kanban board", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Flexible Transition", status: "todo" })
        .expect(201);

      const response = await request(app)
        .put(`/tasks/${task.body.id}`)
        .send({ status: "done" })
        .expect(200);

      expect(response.body.status).toBe("done");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("allows same status (no change)", async () => {
      const task = await request(app)
        .post("/tasks")
        .send({ title: "Same Status", status: "in_progress" })
        .expect(201);

      const updated = await request(app)
        .put(`/tasks/${task.body.id}`)
        .send({ status: "in_progress" })
        .expect(200);

      expect(updated.body.status).toBe("in_progress");

      await request(app).delete(`/tasks/${task.body.id}`);
    });

    it("returns 404 when updating status of non-existent task", async () => {
      await request(app)
        .put("/tasks/999999")
        .send({ status: "done" })
        .expect(404);
    });

    it("E2E: complete lifecycle with REVIEW status - create, update, read, transition, delete", async () => {
      // Step 1: Create a user to assign to the task
      const user = await createUser();

      // Step 2: Create a task in TODO status
      const created = await request(app)
        .post("/tasks")
        .send({
          title: "E2E Review Flow Task",
          description: "Testing complete review workflow",
          status: "todo",
          priority: "high",
          userId: user.id,
        })
        .expect(201);

      expect(created.body.status).toBe("todo");
      expect(created.body.priority).toBe("high");
      expect(created.body.userId).toBe(user.id);
      const taskId = created.body.id;

      // Step 3: Read the task by ID
      const read1 = await request(app).get(`/tasks/${taskId}`).expect(200);
      expect(read1.body.title).toBe("E2E Review Flow Task");
      expect(read1.body.status).toBe("todo");

      // Step 4: Transition to IN_PROGRESS
      const toInProgress = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "in_progress" })
        .expect(200);
      expect(toInProgress.body.status).toBe("in_progress");

      // Step 5: Update task details while in progress
      const updated1 = await request(app)
        .put(`/tasks/${taskId}`)
        .send({
          description: "Updated: Ready for code review",
          priority: "medium",
        })
        .expect(200);
      expect(updated1.body.description).toBe("Updated: Ready for code review");
      expect(updated1.body.priority).toBe("medium");
      expect(updated1.body.status).toBe("in_progress"); // Status unchanged

      // Step 6: Transition to REVIEW status
      const toReview = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "review" })
        .expect(200);
      expect(toReview.body.status).toBe("review");

      // Step 7: Read task in review status
      const read2 = await request(app).get(`/tasks/${taskId}`).expect(200);
      expect(read2.body.status).toBe("review");
      expect(read2.body.description).toBe("Updated: Ready for code review");

      // Step 8: Filter tasks by review status
      const reviewTasks = await request(app)
        .get("/tasks")
        .query({ status: "review" })
        .expect(200);
      const reviewIds = (reviewTasks.body as TaskResponseDto[]).map(
        (t) => t.id,
      );
      expect(reviewIds).toContain(taskId);

      // Step 9: Get grouped tasks and verify task is in review group
      const groupedReview = await request(app)
        .get("/tasks?groupBy=status")
        .expect(200);
      expect(groupedReview.body.review).toBeDefined();
      const reviewGroupIds = groupedReview.body.review.map(
        (t: TaskResponseDto) => t.id,
      );
      expect(reviewGroupIds).toContain(taskId);

      // Step 10: Update description while in review
      const updated2 = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ description: "Review completed - approved" })
        .expect(200);
      expect(updated2.body.description).toBe("Review completed - approved");
      expect(updated2.body.status).toBe("review");

      // Step 11: Transition from review to done
      const toDone = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ status: "done" })
        .expect(200);
      expect(toDone.body.status).toBe("done");

      // Step 12: Verify task is now in done status
      const read3 = await request(app).get(`/tasks/${taskId}`).expect(200);
      expect(read3.body.status).toBe("done");
      expect(read3.body.description).toBe("Review completed - approved");

      // Step 13: Verify task is no longer in review filter
      const reviewTasksAfter = await request(app)
        .get("/tasks")
        .query({ status: "review" })
        .expect(200);
      const reviewIdsAfter = (reviewTasksAfter.body as TaskResponseDto[]).map(
        (t) => t.id,
      );
      expect(reviewIdsAfter).not.toContain(taskId);

      // Step 14: Verify task is now in done group
      const groupedDone = await request(app)
        .get("/tasks?groupBy=status")
        .expect(200);
      expect(groupedDone.body.done).toBeDefined();
      const doneGroupIds = groupedDone.body.done.map(
        (t: TaskResponseDto) => t.id,
      );
      expect(doneGroupIds).toContain(taskId);

      // Step 15: Cleanup - delete task and user
      try {
        await request(app).delete(`/tasks/${taskId}`);
      } catch {
        // Ignore cleanup errors
      }
      try {
        await request(app).delete(`/users/${user.id}`);
      } catch {
        // Ignore cleanup errors
      }
    });
  });
});
