import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';

console.clear();

const stan = nats.connect('ticketing', 'cluster_id_pub', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  new TicketCreatedPublisher(stan).publish({
    id: '1',
    title: 'Music Festival Ticket',
    price: 199,
    userId: randomBytes(4).toString('hex'),
  });
});
