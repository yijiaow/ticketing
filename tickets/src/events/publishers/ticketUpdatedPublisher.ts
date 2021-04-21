import {
  BasePublisher,
  TicketUpdatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
