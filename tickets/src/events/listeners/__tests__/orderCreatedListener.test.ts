import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@yijiao_ticketingdev/common';
import { OrderCreatedListener } from '../orderCreatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const ticket = Ticket.build({
    title: 'EDC',
    price: 500,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('sets orderId on the ticket, publishes ticket update event, acks the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const updated = await Ticket.findById(data.ticket.id);
  expect(updated!.orderId).toBeDefined();
  expect(updated!.orderId).toEqual(data.id);
  expect(message.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.orderId).toEqual(data.id);
});
