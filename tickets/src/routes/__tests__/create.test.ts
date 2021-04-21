import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../natsWrapper';

it('has a route handler listening to /api/tickets/create for post requests', async () => {
  const resp = await request(app).post('/api/tickets/create').send({});
  expect(resp.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets/create').send({}).expect(401);
});

it('returns status code other than 401 if user is signed in', async () => {
  const resp = await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({});
  expect(resp.status).not.toEqual(401);
});

it('returns 400 with missing or invalid title', async () => {
  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ price: 10.99 })
    .expect(400);

  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: '', price: 10.99 })
    .expect(400);
});

it('returns 400 with missing or invalid price', async () => {
  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Music festival ticket' })
    .expect(400);

  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Music festival ticket', price: -100 })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets/create')
    .set('Cookie', global.generateCookie())
    .send({ title: 'Music festival ticket', price: 100 })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
