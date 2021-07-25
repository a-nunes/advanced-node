import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken, FacebookAccount } from '@/domain/models';
import { TokenGenerator } from '@/data/contracts/crypto';

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async execute(
    params: FacebookAuthentication.Params,
  ): Promise<FacebookAuthentication.Result> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email });
      const fbAccount = new FacebookAccount(fbData, accountData);
      const { id } = await this.userAccountRepository.saveWithFacebook(fbAccount);
      const token = await this.crypto.generateToken({ key: id, expiration: AccessToken.expirationInMs });
      return new AccessToken(token);
    }
    return new AuthenticationError();
  }
}
