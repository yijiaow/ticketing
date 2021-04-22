import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandler,
  NotFoundException,
} from '@yijiao_ticketingdev/common';
import { createOrderRouter } from './routes/create';
import { getOrderRouter } from './routes/order';
import { listOrderRouter } from './routes/list';
import { deleteOrderRouter } from './routes/delete';

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

app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(listOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundException();
});

app.use(errorHandler);

export { app };
