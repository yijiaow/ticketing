import request from 'supertest';
import { app } from '../../app';

const createTicket = () =>
  request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Ticket for testing', price: 99.49 });

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const resp = await request(app).get('/api/tickets').send();
  expect(resp.body.length).toEqual(3);
});
