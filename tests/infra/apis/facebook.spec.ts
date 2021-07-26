import { HttpGetClient } from '@/infra/http';
import { FacebookApi } from '@/infra/apis';

import { mock } from 'jest-mock-extended';

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
