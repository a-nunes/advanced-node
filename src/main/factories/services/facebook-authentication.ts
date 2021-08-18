import { FacebookAuthenticationService } from '@/data/services';
import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { env } from '@/main/config/env';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const axiosClient = new AxiosHttpClient();
  const fbApi = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
  const pgUserAccountRepository = new PgUserAccountRepository();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return new FacebookAuthenticationService(fbApi, pgUserAccountRepository, jwtTokenGenerator);
};
