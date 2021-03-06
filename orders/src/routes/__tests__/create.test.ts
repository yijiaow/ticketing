import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Coachella',
    price: 420,
  });
  await ticket.save();
  return ticket;
};

it('returns 404 if ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.generateCookie())
    .send({ ticketId: mongoose.Types.ObjectId() })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {
  const ticket = await buildTicket();

  const order = Order.build({
    userId: 'test_user',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.generateCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await buildTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.generateCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = await buildTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.generateCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
