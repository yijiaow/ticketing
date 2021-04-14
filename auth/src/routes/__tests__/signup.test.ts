import request from 'supertest';
import { app } from '../../app';

it('returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(201);
});

it('returns 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'invalidemail', password: 'password' })
    .expect(400);
});

it('returns 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'pw' })
    .expect(400);
});

it('returns 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: 'password' })
    .expect(400);
});

it('does not allow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(400);
});

it('sets cookie after successful signup', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(201);

  expect(resp.get('Set-Cookie')).toBeDefined();
});
