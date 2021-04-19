import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('nats-test-cluster', 'cluster_id_pub', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  stan.publish(
    'ticket:created',
    JSON.stringify({ id: '1', title: 'Music Festival Ticket', price: 199 }),
    () => {
      console.log('Event published');
    }
  );
});
