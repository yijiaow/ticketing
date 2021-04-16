import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      generateCookie(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'somerandomkey';

  mongo = new MongoMemoryServer();
  const mongoUrl = await mongo.getUri();

  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.generateCookie = () => {
  const email = 'test@test.domain';
  const password = 'password';
  const token = jwt.sign({ email, password }, process.env.JWT_KEY!);

  // Build session object
  const session = { token };
  const sessionJSON = JSON.stringify(session);

  // Encode JSON string as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a cookie with encoded data
  return [`express:sess=${base64}`];
};
