import Queue, { Job } from 'bull';

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: { host: process.env.REDIS_HOST },
});

expirationQueue.process(async (job: Job) => {
  console.log(
    `Publish an expiration:complete event for orderId ${job.data.orderId}`
  );
});
