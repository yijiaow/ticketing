import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { stripe } from '../../stripe';

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

it('returns 201 with valid inputs and creates a charge', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: Math.floor(Math.random() * 1000),
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.generateCookie(order.userId))
    .send({ orderId: order.id, token: 'tok_us' })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 20 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === order.price * 100
  );
  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.amount).toEqual(order.price * 100);
  expect(stripeCharge!.currency).toEqual('usd');

  // expect(stripe.charges.create).toHaveBeenCalled();
  // const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOpts.amount).toEqual(order.price * 100);
  // expect(chargeOpts.currency).toEqual('usd');
  // expect(chargeOpts.source).toEqual('test_token');
});
