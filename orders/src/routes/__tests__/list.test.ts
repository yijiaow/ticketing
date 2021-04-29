import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Coachella',
    price: 420,
  });
  await ticket.save();
  return ticket;
};

it('get a list of orders for a specific user', async () => {
  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.generateCookie();
  const user2 = global.generateCookie();

  // Create two orders as user #1
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket2.id })
    .expect(201);

  // Create one order as user #2
  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Make request to get orders for user #1
  const resp = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send()
    .expect(200);
  expect(resp.body.length).toEqual(2);
  expect(resp.body[0].id).toEqual(order1.id);
  expect(resp.body[1].id).toEqual(order2.id);
  expect(resp.body[0].ticket.id).toEqual(ticket1.id);
  expect(resp.body[1].ticket.id).toEqual(ticket2.id);
});
