import { Router } from 'express';

export default (router: Router): void => {
  router.post('/login/facebook', (_req, res) => {
    res.send({ data: 'hello-world' });
  });
};
