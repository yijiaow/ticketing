import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@yijiao_ticketingdev/common';

const router = express.Router();

router.post(
  '/api/tickets/create',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must not be an empty string'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createTicketRouter };
