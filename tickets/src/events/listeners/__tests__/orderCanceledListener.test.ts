import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCanceledEvent } from '@yijiao_ticketingdev/common';
import { OrderCanceledListener } from '../orderCanceledListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const ticket = Ticket.build({
    title: 'EDC',
    price: 500,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const listener = new OrderCanceledListener(natsWrapper.client);

  const data: OrderCanceledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it('updates the ticket, acks the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  const updated = await Ticket.findById(data.ticket.id);
  expect(updated!.orderId).toBeNull();
  expect(message.ack).toHaveBeenCalled();
});
