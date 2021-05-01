import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  ExpirationCompleteEvent,
  OrderStatus,
} from '@yijiao_ticketingdev/common';
import { ExpirationCompleteListener } from '../expirationCompleteListener';
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

  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const data: ExpirationCompleteEvent['data'] = { orderId: order.id };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { order, listener, data, message };
};

it('updates order status to `canceled`', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const updated = await Order.findById(data.orderId).populate('ticket');
  expect(updated!.status).toEqual(OrderStatus.Canceled);
});

it('publishes order canceled event', async () => {
  const { order, listener, data, message } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
