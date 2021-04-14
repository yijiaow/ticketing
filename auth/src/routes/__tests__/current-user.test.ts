import request from 'supertest';
import { app } from '../../app';

it('responds with details about current user', async () => {
  const cookie = await global.generateCookie();

  const resp = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(resp.body.currentUser.email).toEqual('test@test.domain');
});

it('responds with 401 and error message if user is not authenticated', async () => {
  const resp = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(401);

  expect(resp.body.currentUser).toEqual(undefined);
  expect(resp.body.errors[0]).toEqual({ message: 'Not authorized' });
});
