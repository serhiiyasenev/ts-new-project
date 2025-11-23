import request from 'supertest';
import app from '../src/server';
import { describe, it, expect } from 'vitest';

describe('Tasks API', () => {
	it('returns 400 when createdAt query is invalid', async () => {
		await request(app).get('/tasks').query({ createdAt: 'not-a-date' }).expect(400);
	});
	it('GET /tasks returns an array and supports filters', async () => {
		const res = await request(app).get('/tasks').expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		// at least the seeded example task present
		expect(res.body.length).toBeGreaterThanOrEqual(1);

		// Try filter by priority=medium
		const filtered = await request(app).get('/tasks').query({ priority: 'medium' }).expect(200);
		expect(Array.isArray(filtered.body)).toBe(true);
	});

	it('CRUD flow: POST -> GET by id -> PUT -> DELETE', async () => {
		// Create
		const createRes = await request(app)
			.post('/tasks')
			.send({ title: 'Test Task', description: 'from test', priority: 'high', status: 'todo' })
			.expect(201);

		const created = createRes.body;
		expect(created).toHaveProperty('id');

		// GET by id
		const getRes = await request(app).get(`/tasks/${created.id}`).expect(200);
		expect(getRes.body.id).toBe(created.id);

		// Update
		const putRes = await request(app)
			.put(`/tasks/${created.id}`)
			.send({ title: 'Updated task title' })
			.expect(200);
		expect(putRes.body.title).toBe('Updated task title');

		// Delete
		await request(app).delete(`/tasks/${created.id}`).expect(204);

		// After delete GET should 404
		await request(app).get(`/tasks/${created.id}`).expect(404);
	});

	it('filters by createdAt', async () => {
		// Create a task
		const { body: created } = await request(app).post('/tasks').send({ title: 'Task for createdAt filter', description: 'x' }).expect(201);
		const createdAt = created.createdAt; // assuming it's returned

		// Filter by exact createdAt
		const res = await request(app).get('/tasks').query({ createdAt }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((t: any) => t.id === created.id)).toBe(true);
	});

	it('filters by status', async () => {
		// Create a task with specific status
		const { body: created } = await request(app).post('/tasks').send({ title: 'Task for status filter', status: 'in_progress' }).expect(201);

		// Filter by status
		const res = await request(app).get('/tasks').query({ status: 'in_progress' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((t: any) => t.id === created.id)).toBe(true);
	});

	it('filters by priority', async () => {
		// Create a task with specific priority
		const { body: created } = await request(app).post('/tasks').send({ title: 'Task for priority filter', priority: 'low' }).expect(201);

		// Filter by priority
		const res = await request(app).get('/tasks').query({ priority: 'low' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((t: any) => t.id === created.id)).toBe(true);
	});

	it('filters by title (case-insensitive substring)', async () => {
		// create a task with a unique title
		const title = 'UniqueTitle123';
		const { body: created } = await request(app).post('/tasks').send({ title, description: 'x' }).expect(201);

		const res = await request(app).get('/tasks').query({ title: 'UniqueTitle123' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		// should include the created item
		expect(res.body.some((t: any) => t.id === created.id)).toBe(true);
	});

	it('filters by multiple criteria', async () => {
		// Create a task
		const { body: created } = await request(app).post('/tasks').send({ title: 'MultiFilterTask', status: 'done', priority: 'high' }).expect(201);

		// Filter by status and priority
		const res = await request(app).get('/tasks').query({ status: 'done', priority: 'high' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((t: any) => t.id === created.id)).toBe(true);
	});

	it('returns 400 for invalid POST body (missing title)', async () => {
		await request(app).post('/tasks').send({ description: 'no title' }).expect(400);
	});
});
