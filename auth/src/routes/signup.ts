import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationException } from '../exceptions/requestValidationException';
import { DatabaseConnectionException } from '../exceptions/databaseConnectionException';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationException(errors.array());
    }

    throw new DatabaseConnectionException();
    res.send({});
  }
);

export { router as signUpRouter };
