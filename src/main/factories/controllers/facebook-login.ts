import { FacebookLoginController } from '@/application/controllers';
import { makeFacebookAuthenticationService } from '@/main/factories/services';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const fbAuth = makeFacebookAuthenticationService();
  return new FacebookLoginController(fbAuth);
};
