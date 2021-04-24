import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundException,
  NotAuthorizedException,
} from '@yijiao_ticketingdev/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
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

    res.send(order);
  }
);

export { router as getOrderRouter };
