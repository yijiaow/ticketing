import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent['data'], message: Message) => {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundException();
    }
    ticket.set({ orderId: data.id });
    await ticket.save();

    message.ack();
  };
}
