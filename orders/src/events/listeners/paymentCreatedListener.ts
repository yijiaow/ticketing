import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  PaymentCreatedEvent,
  Subjects,
  OrderStatus,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends BaseListener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: PaymentCreatedEvent['data'], message: Message) => {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();

    message.ack();
  };
}
