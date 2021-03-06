import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('Facebook Api Integration Tests', () => {
  it('should return User Info on success', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);

    const fbUser = await sut.loadUser({ token: env.facebookApi.testUserToken });

    expect(fbUser).toEqual({
      name: 'Artur Test',
      email: 'artur_kkcqexm_test@tfbnw.net',
      facebookId: '100653928990288',
    });
  });

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);

    const fbUser = await sut.loadUser({ token: 'invalid_token' });

    expect(fbUser).toBeUndefined();
  });
});
