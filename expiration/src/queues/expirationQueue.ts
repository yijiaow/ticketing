import Queue, { Job } from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job: Job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
