import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  TicketCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketCreatedEvent['data'], message: Message) => {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();

    message.ack();
  };
}
