import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';

export const setupMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
};
