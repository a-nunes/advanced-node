import { makeFacebookAuthenticationService } from '@/main/factories/services';
import { FacebookLoginController } from '@/application/controllers';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const fbAuth = makeFacebookAuthenticationService();
  return new FacebookLoginController(fbAuth);
};
