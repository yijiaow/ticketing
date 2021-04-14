import request from 'supertest';
import { app } from '../../app';

it('fails when email provided does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(400);
});

it('fails when password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.domain', password: 'wrongpassword' })
    .expect(400);
});

it('responds with cookie set after signing in with valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(201);

  const resp = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.domain', password: 'password' })
    .expect(200);

  expect(resp.get('Set-Cookie')).toBeDefined();
});
