import { FacebookAuthenticationService } from '@/data/services';
import { makeFacebookApi } from '@/main/factories/apis';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/postgres';

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  const fbApi = makeFacebookApi();
  const pgUserAccountRepository = makePgUserAccountRepository();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return new FacebookAuthenticationService(fbApi, pgUserAccountRepository, jwtTokenGenerator);
};
