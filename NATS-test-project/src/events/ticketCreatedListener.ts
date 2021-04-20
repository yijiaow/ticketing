import { Message } from 'node-nats-streaming';
import { BaseListener } from './baseListener';
import { TicketCreatedEvent } from './ticketCreatedEvent';
import { Subjects } from './subjects';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], message: Message) {
    console.log('Event data', data);

    message.ack();
  }
}
