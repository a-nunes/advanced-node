import { Router } from 'express';
import { makeFacebookLoginController } from '@/main/factories/controllers';
import { adaptExpressRouter as adapt } from '@/infra/http';

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()));
};
