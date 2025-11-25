import request from 'supertest';
import app from '../../src/server';
import { describe, it, expect } from 'vitest';

describe('Posts API (comprehensive)', () => {
	// helper to create a user
	async function createUser() {
		const res = await request(app).post('/users').send({ name: 'PostUser', email: `postuser${Date.now()}@example.com` }).expect(201);
		return res.body;
	}

	it('validates userId query and returns 400 for non-numeric', async () => {
		await request(app).get('/posts').query({ userId: 'not-a-number' }).expect(400);
	});

	it('rejects invalid POST userId', async () => {
		const res = await request(app).post('/posts').send({ title: 'x', content: 'y', userId: 0 });
		expect(res.status).toBe(400);
		expect(res.body.message.toLowerCase()).toContain('invalid post payload');
	});

	it('requires userId when creating a post', async () => {
		await request(app).post('/posts').send({ title: 'MissingUser', content: 'Body' }).expect(400);
	});

	it('rejects POST when referenced user does not exist', async () => {
		const res = await request(app).post('/posts').send({ title: 'NoUser', content: 'X', userId: 9999 });
		expect(res.status).toBe(404);
		expect(res.body.message).toContain('User not found');
	});

	it('creates a post (POST) and returns 201 with included user', async () => {
		const user = await createUser();
		const res = await request(app).post('/posts').send({ title: 'Hello', content: 'World', userId: user.id }).expect(201);
		expect(res.body).toHaveProperty('id');
		// Some responses include the joined `user`; others include `userId` only.
		if (res.body.user) {
			expect(res.body.user.id).toBe(user.id);
		} else {
			expect(res.body.userId).toBe(user.id);
		}

		// cleanup
		await request(app).delete(`/posts/${res.body.id}`).expect(204);
		await request(app).delete(`/users/${user.id}`).expect(204);
	});

	it('validates POST body and returns 400 when missing required fields', async () => {
		const user = await createUser();
		await request(app).post('/posts').send({ content: 'no title', userId: user.id }).expect(400);
		await request(app).delete(`/users/${user.id}`).expect(204);
	});

	it('GET /posts supports filters: title, content, userId', async () => {
		const user = await createUser();
		const title = `PT${Date.now()}`;
		const { body: created } = await request(app).post('/posts').send({ title, content: 'filtercontent', userId: user.id }).expect(201);

		const byTitle = await request(app).get('/posts').query({ title }).expect(200);
		expect(byTitle.body.some((p: any) => p.id === created.id)).toBe(true);

		const byContent = await request(app).get('/posts').query({ content: 'filter' }).expect(200);
		expect(byContent.body.some((p: any) => p.id === created.id)).toBe(true);

		const byUser = await request(app).get('/posts').query({ userId: user.id.toString() }).expect(200);
		expect(byUser.body.some((p: any) => p.id === created.id)).toBe(true);

		// cleanup
		await request(app).delete(`/posts/${created.id}`).expect(204);
		await request(app).delete(`/users/${user.id}`).expect(204);
	});

	it('CRUD for posts: create -> get -> update -> delete and validation on update', async () => {
		const user = await createUser();
		const { body: created } = await request(app).post('/posts').send({ title: 'CrudPost', content: 'c', userId: user.id }).expect(201);

		await request(app).get(`/posts/${created.id}`).expect(200);

		await request(app).put(`/posts/${created.id}`).send({ actorUserId: user.id, title: '' }).expect(400);
		await request(app).put(`/posts/${created.id}`).send({ actorUserId: user.id }).expect(400);

		// valid partial update
		const updated = await request(app).put(`/posts/${created.id}`).send({ actorUserId: user.id, content: 'updated' }).expect(200);
		expect(updated.body.content).toBe('updated');

		await request(app).delete(`/posts/${created.id}`).expect(204);
		await request(app).delete(`/users/${user.id}`).expect(204);
	});

	it('PUT non-existent returns 404 and DELETE non-existent returns 404', async () => {
		await request(app).put('/posts/999999').send({ actorUserId: 1, title: 'X' }).expect(404);
		await request(app).delete('/posts/999999').expect(404);
	});

	it('prevents updating a post by a different user and requires actorUserId', async () => {
		const owner = await createUser();
		const intruder = await createUser();
		const { body: post } = await request(app).post('/posts').send({ title: 'Secure', content: 'Secret', userId: owner.id }).expect(201);

		// missing actor id
		await request(app).put(`/posts/${post.id}`).send({ title: 'Fail' }).expect(400);

		// wrong user
		const forbidden = await request(app)
			.put(`/posts/${post.id}`)
			.send({ actorUserId: intruder.id, content: 'Hack' });
		expect(forbidden.status).toBe(403);
		expect(forbidden.body.message.toLowerCase()).toContain('forbidden');

		await request(app)
			.put(`/posts/${post.id}`)
			.send({ actorUserId: owner.id, content: 'Owner update' })
			.expect(200);

		await request(app).delete(`/posts/${post.id}`).expect(204);
		await request(app).delete(`/users/${owner.id}`).expect(204);
		await request(app).delete(`/users/${intruder.id}`).expect(204);
	});

	it('filters by title/content case-insensitively and by userId simultaneously', async () => {
		const user = await createUser();
		const title = 'CaseMatchTitle';
		const content = 'CaseMatchContent';
		const { body: created } = await request(app)
			.post('/posts')
			.send({ title, content, userId: user.id })
			.expect(201);

		const filters = await request(app)
			.get('/posts')
			.query({ title: 'casematch', content: 'content', userId: user.id.toString() })
			.expect(200);

		expect(filters.body.some((p: any) => p.id === created.id)).toBe(true);

		await request(app).delete(`/posts/${created.id}`).expect(204);
		await request(app).delete(`/users/${user.id}`).expect(204);
	});
});
