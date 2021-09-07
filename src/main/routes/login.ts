import { Router } from 'express';
import { makeFacebookLoginController } from '@/main/factories/controllers';
import { adaptExpressRouter as adapt } from '@/main/adapters';

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()));
};
