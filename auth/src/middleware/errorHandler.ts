import { Request, Response, NextFunction } from 'express';
import { RequestValidationException } from '../exceptions/requestValidationException';
import { DatabaseConnectionException } from '../exceptions/databaseConnectionException';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationException) {
    const formattedErrors = err.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
    return res.status(400).send({ errors: formattedErrors });
  }
  if (err instanceof DatabaseConnectionException) {
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }
  res.status(400).send({
    errors: [{ message: 'Something went wrong' }],
  });
};
