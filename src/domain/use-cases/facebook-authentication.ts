import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';
import { AuthenticationError, AccessToken, FacebookAccount } from '@/domain/entities';

type Setup = (facebook: LoadFacebookUser, userAccountRepository: LoadUserAccount & SaveFacebookAccount, crypto: TokenGenerator) => FacebookAuthentication;
type Input = { token: string };
type Output = { accessToken: string };
export type FacebookAuthentication = (input: Input) => Promise<Output>;

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepository, crypto) => async (input) => {
  const fbData = await facebook.loadUser(input);
  if (!fbData) throw new AuthenticationError();
  const accountData = await userAccountRepository.load({ email: fbData.email });
  const fbAccount = new FacebookAccount(fbData, accountData);
  const { id } = await userAccountRepository.saveWithFacebook(fbAccount);
  const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });
  return { accessToken };
};
