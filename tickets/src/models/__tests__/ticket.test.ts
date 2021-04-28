import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'Ticket for testing',
    price: 99.49,
    userId: 'test_user',
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set('price', 15);
  secondInstance!.set('price', 10);

  await firstInstance!.save();

  // Save the second instance and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
});

it('increments version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Ticket for testing',
    price: 99.49,
    userId: 'test_user',
  });

  await ticket.save();
  expect(ticket.__v).toEqual(0);

  await ticket.save();
  expect(ticket.__v).toEqual(1);

  await ticket.save();
  expect(ticket.__v).toEqual(2);
});
