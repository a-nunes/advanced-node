import { makeFacebookLoginController } from '@/main/factories/controllers';
import { adaptExpressRouter as adapt } from '@/infra/http';

import { Router } from 'express';

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()));
};
