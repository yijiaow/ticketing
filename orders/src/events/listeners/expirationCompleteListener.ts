import { Message } from 'node-nats-streaming';
import {
  BaseListener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from '@yijiao_ticketingdev/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';
import { natsWrapper } from '../../natsWrapper';
import { OrderCanceledPublisher } from '../publishers/orderCanceledPublisher';

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  onMessage = async (
    data: ExpirationCompleteEvent['data'],
    message: Message
  ) => {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return message.ack();
    }
    order.set({
      status: OrderStatus.Canceled,
    });
    await order.save();

    await new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      __v: order.__v,
      ticket: {
        id: order.ticket.id,
      },
    });

    message.ack();
  };
}
