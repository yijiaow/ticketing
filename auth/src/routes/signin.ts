import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestException,
} from '@yijiao_ticketingdev/common';
import { User } from '../models/user';
import { Password } from '../services/hash';

const router = express.Router();

router.post(
  '/api/users/signin',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must provide a password'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await Password.compare(existingUser.password, password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );
    req.session = {
      token,
    };

    res.status(200).send({ existingUser });
  }
);

export { router as signInRouter };
