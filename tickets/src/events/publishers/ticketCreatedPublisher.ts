import {
  BasePublisher,
  TicketCreatedEvent,
  Subjects,
} from '@yijiao_ticketingdev/common';

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
