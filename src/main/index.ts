/* eslint-disable no-console */
import './config/module-alias';
import 'dotenv/config';
import { createConnection } from 'typeorm';

import { app } from '@/main/config/app';
import { env } from '@/main/config/env';

import 'reflect-metadata';

createConnection()
  .then(() => { app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`)); })
  .catch(console.error);
