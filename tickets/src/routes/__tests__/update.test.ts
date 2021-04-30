import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../natsWrapper';

it('returns 404 if provided ticket id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.generateCookie())
    .send({ title: 'Ticket for testing', price: 99.49 })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  const resp = await request(app).put(`/api/tickets/${id}`).send({});
  expect(resp.status).toEqual(401);
});

it('returns 401 if user does not own the ticket', async () => {
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Ticket for testing', price: 99.49 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', global.generateCookie())
    .send({ title: 'Ticket for testing', price: 99.49 })
    .expect(401);
});

it('returns 400 with missing or invalid inputs', async () => {
  const cookie = global.generateCookie();
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket (on sale)' })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 50 })
    .expect(400);
});

it('updates the ticket with valid inputs', async () => {
  const cookie = global.generateCookie();
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket (on sale)', price: 50 })
    .expect(200);

  const ticket = await Ticket.findById(resp.body.id);
  expect(ticket?.title).toEqual('Music festival ticket (on sale)');
  expect(ticket?.price).toEqual(50);
});

it('publishes an event', async () => {
  const cookie = global.generateCookie();
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket (on sale)', price: 50 })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if ticket is reserved', async () => {
  const cookie = global.generateCookie();
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);

  const ticket = await Ticket.findById(resp.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Music festival ticket (on sale)', price: 50 })
    .expect(400);
});
