import {
  BasePublisher,
  PaymentCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class PaymentCreatedPublisher extends BasePublisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
