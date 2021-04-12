import express, { Request, Response } from 'express';
import { currentUser } from '../middleware/currentUser';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

router.get(
  '/api/users/current-user',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
