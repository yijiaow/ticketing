import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import {
  requireAuth,
  validateRequest,
  NotFoundException,
  NotAuthorizedException,
  BadRequestException,
  OrderStatus,
} from '@yijiao_ticketingdev/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/PaymentCreatedPublisher';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('orderId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Valid orderId must be provided'),
    body('token').notEmpty().withMessage('Token must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundException();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedException();
    }
    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestException('Order has been canceled');
    }

    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
      description: `Order #${order.id}`,
    });

    const payment = Payment.build({ orderId: order.id, stripeId: charge.id });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createPaymentRouter };
