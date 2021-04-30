import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundException,
  NotAuthorizedException,
  BadRequestException,
} from '@yijiao_ticketingdev/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticketUpdatedPublisher';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must not be an empty string'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundException();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedException();
    }
    if (ticket.orderId) {
      throw new BadRequestException('Cannot edit a reserved ticket');
    }

    const { title, price } = req.body;
    const updated = ticket.set({ title, price });
    await updated.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      __v: ticket.__v,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(updated);
  }
);

export { router as updateTicketRouter };
