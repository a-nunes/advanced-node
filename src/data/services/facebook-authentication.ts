import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
      SaveFacebookAccountRepository,
  ) {}

  async execute(
    params: FacebookAuthentication.Params,
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params);
    if (fbData) {
      const accountData = await this.userAccountRepository.load({
        email: fbData.email,
      });
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        email: fbData.email,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
