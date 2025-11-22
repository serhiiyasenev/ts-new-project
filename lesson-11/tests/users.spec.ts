import request from 'supertest';
import app from '../src/server';
import { describe, it, expect } from 'vitest';

describe('Users API', () => {
	it('returns 400 when createdAt query is invalid', async () => {
		await request(app).get('/users').query({ createdAt: 'not-a-date' }).expect(400);
	});
	it('GET /users returns an array', async () => {
		const res = await request(app).get('/users').expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(1);
	});

	it('CRUD flow for users', async () => {
		// POST
		const createRes = await request(app).post('/users').send({ name: 'TestUser' }).expect(201);
		const created = createRes.body;
		expect(created).toHaveProperty('id');

		// GET by id
		const getRes = await request(app).get(`/users/${created.id}`).expect(200);
		expect(getRes.body.name).toBe('TestUser');

		// PUT
		const putRes = await request(app).put(`/users/${created.id}`).send({ name: 'UpdatedName' }).expect(200);
		expect(putRes.body.name).toBe('UpdatedName');

		// DELETE
		await request(app).delete(`/users/${created.id}`).expect(204);

		// Not found
		await request(app).get(`/users/${created.id}`).expect(404);
	});

	it('returns 400 for invalid POST body (name too short)', async () => {
		await request(app).post('/users').send({ name: 'ab' }).expect(400);
	});
});

