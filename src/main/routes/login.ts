import { ExpressRouter } from '@/infra/http';
import { makeFacebookLoginController } from '@/main/factories/controllers';
import { Router } from 'express';

const controller = makeFacebookLoginController();
const fbLoginRouter = new ExpressRouter(controller);

export default (router: Router): void => {
  router.post('/login/facebook', fbLoginRouter.adapt);
};
