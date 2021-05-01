import {
  BasePublisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
