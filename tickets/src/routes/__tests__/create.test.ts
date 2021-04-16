import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets/create for post requests', async () => {
  const resp = await request(app).post('/api/tickets/create').send({});
  expect(resp.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets/create').send({}).expect(401);
});

it('returns status code other than 401 if user is signed in', async () => {
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({});
  expect(resp.status).not.toEqual(401);
});
