import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCanceledEvent, OrderStatus } from '@yijiao_ticketingdev/common';
import { OrderCanceledListener } from '../orderCanceledListener';
import { natsWrapper } from '../../../natsWrapper';
import { Order } from '../../../models/order';

const setup = async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: 'test_user',
    status: OrderStatus.Created,
    price: 200,
  });
  await order.save();

  const listener = new OrderCanceledListener(natsWrapper.client);

  const data: OrderCanceledEvent['data'] = {
    id: order.id,
    __v: order.__v + 1,
    ticket: { id: mongoose.Types.ObjectId().toHexString() },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { order, listener, data, message };
};

it('sets order status to `canceled` and acks the message', async () => {
  const { order, listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const updated = await Order.findById(order.id);
  expect(updated!.__v).toEqual(data.__v);
  expect(updated!.status).toEqual(OrderStatus.Canceled);
  expect(message.ack).toHaveBeenCalled();
});
