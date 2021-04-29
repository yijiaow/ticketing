import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@yijiao_ticketingdev/common';
import { TicketCreatedListener } from '../ticketCreatedListener';
import { natsWrapper } from '../../../natsWrapper';
import { Ticket } from '../../../models/ticket';

const setup = () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    __v: 0,
    title: 'EDC',
    price: 500,
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { listener, data, message };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = setup();

  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = setup();
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});
