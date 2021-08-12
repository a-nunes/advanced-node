import './config/module-alias';

import 'reflect-metadata';
import express, { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const router = Router();

router.post('/api/login/facebook', (_req, res) => {
  res.send({ data: 'hello-world' });
});

app.use(router);

app.listen(8080, () => console.log('Server running on http://localhost:8080'));
