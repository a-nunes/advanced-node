import { FacebookAuthenticationService } from '@/data/services';
import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/postgres';

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const axiosClient = new AxiosHttpClient();
  const fbApi = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
  const pgUserAccountRepository = makePgUserAccountRepository();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return new FacebookAuthenticationService(fbApi, pgUserAccountRepository, jwtTokenGenerator);
};
