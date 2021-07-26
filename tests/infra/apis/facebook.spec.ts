import { HttpGetClient } from '@/infra/http';
import { FacebookApi } from '@/infra/apis';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookApi', () => {
  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;
  let clientId: string;
  let clientSecret: string;

  beforeAll(() => {
    httpClient = mock();
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
  });

  beforeEach(() => {
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_user_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: 'any_client_id',
        client_secret: 'any_client_secret',
        grant_type: 'client_credentials',
      },
    });
  });
});
