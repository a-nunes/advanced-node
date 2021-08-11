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
    httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' });
    httpClient.get.mockResolvedValueOnce({ data: { user_id: 'any_user_id' } });
    httpClient.get.mockResolvedValueOnce({ id: 'any_user_id', name: 'any_user_name', email: 'any_user_email' });
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

  it('should get user info', async () => {
    const result = await sut.loadUser({ token });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: token,
      },
    });
    expect(result).toEqual({
      facebookId: 'any_user_id',
      name: 'any_user_name',
      email: 'any_user_email',
    });
  });

  it('should return undefined if request fails', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('fb_error'));

    const result = await sut.loadUser({ token });

    expect(result).toBeUndefined();
  });
});
