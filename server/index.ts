import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const server = express();

const allowedOrigin = process.env.CLIENT_URL || '';

server.use(((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin === allowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
}) as express.RequestHandler);

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  await app.init();
};

void createNestServer(server);

export const api = functions.https.onRequest(server);
