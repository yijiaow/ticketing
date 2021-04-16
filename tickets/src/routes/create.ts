import express, { Request, Response } from 'express';
import { requireAuth } from '@yijiao_ticketingdev/common';

const router = express.Router();

router.post(
  '/api/tickets/create',
  requireAuth,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createTicketRouter };
