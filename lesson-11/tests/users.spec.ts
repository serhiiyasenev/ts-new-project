import request from 'supertest';
import app from '../src/server';
import { describe, it, expect } from 'vitest';

describe('Users API', () => {
	it('accepts any string as email query parameter', async () => {
		await request(app).get('/users').query({ email: 'not-an-email' }).expect(200);
	});
	it('GET /users returns an array', async () => {
		const res = await request(app).get('/users').expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThanOrEqual(1);
	});

	it('CRUD flow for users', async () => {
		const timestamp = Date.now();
		// POST
		const createRes = await request(app).post('/users').send({ name: 'TestUser', email: `testuser${timestamp}@example.com` }).expect(201);
		const created = createRes.body;
		expect(created).toHaveProperty('id');
		expect(typeof created.id).toBe('number');

		// GET by id
		const getRes = await request(app).get(`/users/${created.id}`).expect(200);
		expect(getRes.body.name).toBe('TestUser');
		expect(getRes.body.email).toBe(`testuser${timestamp}@example.com`);

		// PUT
		const putRes = await request(app).put(`/users/${created.id}`).send({ name: 'UpdatedName' }).expect(200);
		expect(putRes.body.name).toBe('UpdatedName');

		// DELETE
		await request(app).delete(`/users/${created.id}`).expect(204);

		// Not found
		await request(app).get(`/users/${created.id}`).expect(404);
	});

	it('returns 400 for invalid PUT body (name too short)', async () => {
		const timestamp = Date.now();
		// Create a user first
		const createRes = await request(app).post('/users').send({ name: 'ValidUser', email: `validuser${timestamp}@example.com` }).expect(201);
		const created = createRes.body;

		// Try to update with invalid name
		await request(app).put(`/users/${created.id}`).send({ name: 'ab' }).expect(400);
	});

	it('returns 404 for updating non-existent user', async () => {
		await request(app).put('/users/99999').send({ name: 'NewName' }).expect(404);
	});

	it('filters by email', async () => {
		const timestamp = Date.now();
		// Create a user
		const { body: created } = await request(app).post('/users').send({ name: 'UserForEmailFilter', email: `filteruser${timestamp}@example.com` }).expect(201);

		// Filter by email
		const res = await request(app).get('/users').query({ email: `filteruser${timestamp}@example.com` }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((u: any) => u.id === created.id)).toBe(true);
	});

	it('filters by name (case-insensitive substring)', async () => {
		const timestamp = Date.now();
		// Create a user with unique name
		const name = 'UniqueUserName123';
		const { body: created } = await request(app).post('/users').send({ name, email: `uniqueuser${timestamp}@example.com` }).expect(201);

		// Filter by name substring
		const res = await request(app).get('/users').query({ name: 'UniqueUserName' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((u: any) => u.id === created.id)).toBe(true);
	});

	it('filters by multiple criteria', async () => {
		const timestamp = Date.now();
		// Create a user
		const { body: created } = await request(app).post('/users').send({ name: 'MultiFilterUser', email: `multifilter${timestamp}@example.com` }).expect(201);

		// Filter by email and name
		const res = await request(app).get('/users').query({ email: `multifilter${timestamp}@example.com`, name: 'Multi' }).expect(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.some((u: any) => u.id === created.id)).toBe(true);
	});
});
