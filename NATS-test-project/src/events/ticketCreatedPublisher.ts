import { BasePublisher } from './basePublisher';
import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
