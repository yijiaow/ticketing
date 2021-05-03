import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@yijiao_ticketingdev/common';
import { OrderCreatedListener } from '../orderCreatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Order } from '../../../models/order';

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId: 'test_user',
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: { id: mongoose.Types.ObjectId().toHexString(), price: 200 },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('replicates the order and acks the message', async () => {
  const { listener, data, message } = setup();
  await listener.onMessage(data, message);
  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
  expect(message.ack).toHaveBeenCalled();
});
