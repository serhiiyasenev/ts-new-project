import request from 'supertest';
import app from '../src/server';
import { describe, it, expect } from 'vitest';

describe('Tasks API', () => {
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
});
