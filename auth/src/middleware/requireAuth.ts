import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedException } from '../exceptions/NotAuthorizedException';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedException();
  }
  next();
};
