import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/tickets/create', async (req: Request, res: Response) => {
  res.send({});
});

export { router as createTicketRouter };
