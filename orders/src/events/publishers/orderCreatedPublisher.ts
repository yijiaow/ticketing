import {
  BasePublisher,
  OrderCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
