import { LoadFacebookUserApi } from '@/data/contracts/apis';

import { mock } from 'jest-mock-extended';

interface HttpGetClient {
  get(params: HttpGetClient.Params): Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>();
    const clientId = 'any_client_id';
    const clientSecret = 'any_client_secret';
    const sut = new FacebookApi(httpClient, clientId, clientSecret);

    await sut.loadUser({ token: 'any_user_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: 'any_client_id',
        client_secret: 'any_client_secret',
        grant_type: 'client_credentials',
      },
    });
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });
});
