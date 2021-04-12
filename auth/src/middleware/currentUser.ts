import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface Payload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: Payload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.token) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.token,
      process.env.JWT_KEY!
    ) as Payload;
    req.currentUser = payload;
  } catch (err) {
    console.error(err);
  }
  next();
};
