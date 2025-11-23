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

	it('returns 400 for invalid PUT body (name too short)', async () => {
		// Create a user first
		const createRes = await request(app).post('/users').send({ name: 'ValidUser' }).expect(201);
		const created = createRes.body;

		// Try to update with invalid name
		await request(app).put(`/users/${created.id}`).send({ name: 'ab' }).expect(400);
	});

	it('returns 404 for updating non-existent user', async () => {
		await request(app).put('/users/non-existent-id').send({ name: 'NewName' }).expect(404);
	});

	it('filters by createdAt', async () => {
		// Get all users to get the date
		const allRes = await request(app).get('/users').expect(200);
		const someUser = allRes.body[0];
		const createdAtPrefix = someUser.createdAt.substring(0, 10); // YYYY-MM-DD

		// Filter by date prefix
		const res = await request(app).get('/users').query({ createdAt: createdAtPrefix }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body.every((u: any) => u.createdAt.startsWith(createdAtPrefix))).toBe(true);
	});

	it('filters by name (case-insensitive substring)', async () => {
		// Filter by name that matches seeded user
		const res = await request(app).get('/users').query({ name: 'john' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
		expect(res.body.every((u: any) => u.name.toLowerCase().includes('john'))).toBe(true);
	});

	it('filters by multiple criteria', async () => {
		// Get all users
		const allRes = await request(app).get('/users').expect(200);
		const someUser = allRes.body[0];
		const createdAtPrefix = someUser.createdAt.substring(0, 10);

		// Filter by createdAt and name
		const res = await request(app).get('/users').query({ createdAt: createdAtPrefix, name: 'doe' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.every((u: any) => u.createdAt.startsWith(createdAtPrefix) && u.name.toLowerCase().includes('doe'))).toBe(true);
	});
});
