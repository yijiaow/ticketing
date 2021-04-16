import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      generateCookie(): Promise<string[]>;
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

global.generateCookie = async () => {
  const email = 'test@test.domain';
  const password = 'password';
  const resp = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = resp.get('Set-Cookie');
  return cookie;
};
