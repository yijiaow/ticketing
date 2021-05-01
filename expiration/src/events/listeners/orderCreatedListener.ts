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
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to process this job`);

    await expirationQueue.add({ orderId: data.id }, { delay: delay });

    message.ack();
  };
}
