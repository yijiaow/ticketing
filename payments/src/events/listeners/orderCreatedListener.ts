import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent['data'], message: Message) => {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
    });
    await order.save();

    message.ack();
  };
}
