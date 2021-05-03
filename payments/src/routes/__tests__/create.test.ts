import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';

it('returns 404 when the order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.generateCookie())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: 'test_token',
    })
    .expect(404);
});

it('returns 401 when the order does not belong to current user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 500,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.generateCookie())
    .send({ orderId: order.id, token: 'test_token' })
    .expect(401);
});

it('returns 400 when purchasing a canceled order', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Canceled,
    price: 500,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.generateCookie(order.userId))
    .send({ orderId: order.id, token: '' })
    .expect(400);
});

it('returns 201 with valid inputs', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 500,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.generateCookie(order.userId))
    .send({ orderId: order.id, token: 'test_token' })
    .expect(201);
});
