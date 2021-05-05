import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { PaymentCreatedEvent, OrderStatus } from '@yijiao_ticketingdev/common';
import { PaymentCreatedListener } from '../paymentCreatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'EDC',
    price: 500,
  });
  await ticket.save();

  const order = Order.build({
    userId: 'test_user',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  const listener = new PaymentCreatedListener(natsWrapper.client);
  const data: PaymentCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: 'fake_stripe_id',
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { order, listener, data, message };
};

it('updates order status to `complete`', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const updated = await Order.findById(data.orderId);
  expect(updated!.status).toEqual(OrderStatus.Complete);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
