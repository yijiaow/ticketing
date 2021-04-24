import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({ title: 'Coachella', price: 420 });
  await ticket.save();
  return ticket;
};

it('fetches order', async () => {
  const ticket = await buildTicket();
  const user = global.generateCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const resp = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(resp.body.id).toEqual(order.id);
});

it('returns 401 if user tries to fetch an order from another user', async () => {
  const ticket = await buildTicket();

  const user1 = global.generateCookie();
  const user2 = global.generateCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .send()
    .expect(401);
});
