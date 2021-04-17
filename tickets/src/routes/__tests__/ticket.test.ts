import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if the ticket is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns ticket if the ticket is found', async () => {
  const cookie = global.generateCookie();
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', cookie)
    .send({ title: 'Ticket for testing', price: 99.49 });

  const ticketResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .expect(200);

  expect(ticketResp.body.title).toEqual('Ticket for testing');
  expect(ticketResp.body.price).toEqual(99.49);
});
