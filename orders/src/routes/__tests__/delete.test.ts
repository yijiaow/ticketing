import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';

const buildTicket = async () => {
  const ticket = Ticket.build({ title: 'Coachella', price: 420 });
  await ticket.save();
  return ticket;
};

it('changes order status to `canceled`', async () => {
  const ticket = await buildTicket();
  const user = global.generateCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const updated = await Order.findById(order.id);
  expect(updated!.status).toEqual(OrderStatus.Canceled);
});

it('emits an order canceled event', async () => {
  const ticket = await buildTicket();
  const user = global.generateCookie();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .put(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
