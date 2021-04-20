import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticketCreatedPublisher';

console.clear();

const stan = nats.connect('nats-test-cluster', 'cluster_id_pub', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '1',
      title: 'Music Festival Ticket',
      price: 199,
      userId: randomBytes(4).toString('hex'),
    });
  } catch (err) {
    console.error(err);
  }
});
