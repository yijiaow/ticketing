import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from '../../queues/expirationQueue';

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent['data'], message: Message) => {
    await expirationQueue.add({ orderId: data.id });
    message.ack();
  };
}
