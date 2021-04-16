import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandler,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { createTicketRouter } from './routes/create';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundException();
});

app.use(errorHandler);

export { app };
