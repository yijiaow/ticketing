import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  OrderCanceledEvent,
  Subjects,
  OrderStatus,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';

export class OrderCanceledListener extends BaseListener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCanceledEvent['data'], message: Message) => {
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();

    message.ack();
  };
}
