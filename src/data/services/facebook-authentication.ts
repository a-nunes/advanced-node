import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async execute(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params);
  }
}
