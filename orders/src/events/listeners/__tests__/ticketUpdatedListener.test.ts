import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@yijiao_ticketingdev/common';
import { TicketUpdatedListener } from '../ticketUpdatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'EDC',
    price: 500,
  });
  await ticket.save();

  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    __v: ticket.__v + 1,
    title: 'Electric Daisy Carnival',
    price: 450,
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { ticket, listener, data, message };
};

it('finds, updates and saves a ticket', async () => {
  const { ticket, listener, data, message } = await setup();

  await listener.onMessage(data, message);
  const updated = await Ticket.findById(ticket.id);
  expect(updated!.__v).toEqual(data.__v);
  expect(updated!.title).toEqual(data.title);
  expect(updated!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

it('does not ack if event has a skipped version', async () => {
  const { listener, data, message } = await setup();
  data.__v = 10;
  try {
    await listener.onMessage(data, message);
  } catch (err) {}

  expect(message.ack).not.toHaveBeenCalled();
});
