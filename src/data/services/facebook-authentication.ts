import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  CreateUserByFacebookAccountRepository,
  UpdateUserByFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      CreateUserByFacebookAccountRepository &
      UpdateUserByFacebookAccountRepository,
  ) {}

  async execute(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      const accountData = await this.userAccountRepository.load({
        email: fbData.email,
      });
      if (accountData) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId,
        });
      }
      await this.userAccountRepository.createFromFacebook(fbData);
    }
    return new AuthenticationError();
  }
}
