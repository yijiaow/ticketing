import { Message } from 'node-nats-streaming';
import { BaseListener } from './baseListener';

export class TicketCreatedListener extends BaseListener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';

  onMessage(data: any, message: Message) {
    console.log('Event data', data);

    message.ack();
  }
}
