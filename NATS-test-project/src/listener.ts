import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('nats-test-cluster', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-qgroup',
    options
  );
  subscription.on('message', (message: Message) => {
    console.log(
      `Received event #${message.getSequence()}, with data ${message.getData()}`
    );
    message.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
