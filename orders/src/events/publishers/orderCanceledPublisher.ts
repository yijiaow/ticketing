import {
  BasePublisher,
  OrderCanceledEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class OrderCanceledPublisher extends BasePublisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
