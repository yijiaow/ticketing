import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.generateCookie())
    .send({ ticketId: mongoose.Types.ObjectId() })
    .expect(404);
});

it('returns an error if ticket is already reserved', async () => {});

it('reserves a ticket', async () => {});

it('emits an order created event', async () => {});
