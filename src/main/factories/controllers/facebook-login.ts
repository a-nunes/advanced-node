import { FacebookLoginController } from '@/application/controllers';
import { FacebookAuthenticationService } from '@/data/services';
import { FacebookApi } from '@/infra/apis';
import { JwtTokenGenerator } from '@/infra/crypto';
import { AxiosHttpClient } from '@/infra/http';
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { env } from '@/main/config/env';

export const makeFacebookLoginController = (): FacebookLoginController => {
  const axiosClient = new AxiosHttpClient();
  const fbApi = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
  const pgUserAccountRepository = new PgUserAccountRepository();
  const jwtTokenGenerator = new JwtTokenGenerator(env.jwtSecret);
  const fbAuth = new FacebookAuthenticationService(fbApi, pgUserAccountRepository, jwtTokenGenerator);
  return new FacebookLoginController(fbAuth);
};
