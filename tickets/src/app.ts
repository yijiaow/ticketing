import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandler,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { createTicketRouter } from './routes/create';
import { getTicketRouter } from './routes/ticket';
import { listTicketRouter } from './routes/list';

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
app.use(getTicketRouter);
app.use(listTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundException();
});

app.use(errorHandler);

export { app };
