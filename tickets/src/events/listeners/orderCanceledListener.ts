import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  OrderCanceledEvent,
  Subjects,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/ticket';

export class OrderCanceledListener extends BaseListener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCanceledEvent['data'], message: Message) => {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundException();
    }
    ticket.set({ orderId: null });
    await ticket.save();

    message.ack();
  };
}
