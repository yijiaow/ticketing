import express from 'express';
import 'express-async-errors';
import { NotFoundException } from './exceptions/notFoundException';
import { errorHandler } from './middleware/errorHandler';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', async (req, res) => {
  throw new NotFoundException();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
