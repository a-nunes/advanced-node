/* eslint-disable no-console */
import './config/module-alias';
import 'dotenv/config';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';

import 'reflect-metadata';

app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
