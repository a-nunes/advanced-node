import { makeFacebookApi } from '@/main/factories/apis';
import { makeJwtTokenGenerator } from '@/main/factories/crypto';
import { makePgUserAccountRepository } from '@/main/factories/postgres';
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases';

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  const fbApi = makeFacebookApi();
  const pgUserAccountRepository = makePgUserAccountRepository();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return setupFacebookAuthentication(fbApi, pgUserAccountRepository, jwtTokenGenerator);
};
