import { HttpGetClient } from '@/infra/http';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

type UserInfo = {
  id: string,
  name: string,
  email: string
};

type DebugToken = {
  data: {
    user_id: string
  }
};

type AppToken = {
  access_token: string;
};
export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    const userInfo = await this.getUserInfo(params.token);
    return {
      facebookId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }

  private async getUserInfo(inputToken: string): Promise<UserInfo> {
    const debugToken = await this.getDebugToken(inputToken);
    return this.httpClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: inputToken,
      },
    });
  }

  private async getDebugToken(inputToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken();
    return this.httpClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: inputToken,
      },
    });
  }

  private async getAppToken(): Promise<AppToken> {
    return this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}
