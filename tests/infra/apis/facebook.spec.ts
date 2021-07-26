import { HttpGetClient } from '@/infra/http';
import { FacebookApi } from '@/infra/apis';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookApi', () => {
  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;
  let clientId: string;
  let clientSecret: string;
  let token: string;

  beforeAll(() => {
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
    token = 'any_user_token';
    httpClient = mock();
  });

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' });
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });

  it('should get debug token', async () => {
    await sut.loadUser({ token });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: token,
      },
    });
  });
});
