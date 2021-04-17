import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  validateRequest,
  BadRequestException,
} from '@yijiao_ticketingdev/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const newUser = await User.build({ email, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_KEY!
    );
    req.session = {
      token,
    };

    res.status(201).send(newUser);
  }
);

export { router as signUpRouter };
