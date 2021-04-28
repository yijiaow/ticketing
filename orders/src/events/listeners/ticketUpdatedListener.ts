import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  TicketUpdatedEvent,
  Subjects,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketUpdatedEvent['data'], message: Message) => {
    const { id, __v, title, price } = data;
    const ticket = await Ticket.findOne({ _id: id, __v: __v - 1 });
    if (!ticket) {
      throw new NotFoundException();
    }
    ticket.set({ title, price });
    await ticket.save();

    message.ack();
  };
}
