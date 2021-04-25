import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundException,
  NotAuthorizedException,
} from '@yijiao_ticketingdev/common';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../natsWrapper';
import { OrderCanceledPublisher } from '../events/publishers/orderCanceledPublisher';

const router = express.Router();

router.put(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
      throw new NotFoundException();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedException();
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();

    new OrderCanceledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: { id: order.ticket.id },
    });
    res.send(order);
  }
);

export { router as deleteOrderRouter };
