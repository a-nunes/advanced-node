import { FacebookApi } from '@/infra/apis';
import { AxiosHttpClient } from '@/infra/http';
import { env } from '@/main/config/env';

describe('Facebook Api Integration Tests', () => {
  it('should return User Info on success', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret);

    // eslint-disable-next-line max-len
    const fbUser = await sut.loadUser({ token: 'EAAHenjZCpIsYBAPQWC5EimlTi4wBjhbkpGcM2w84XL7YiIFcwTLO56085hfZCswn3AG1E3MsUUuLqrOiVDY2srMCwTPwup2uaCHkGAdPFNf4cTbw1gTHh01JBVp8Wwqzy4i4Ux8F4y1pWQ2I6ZC7b9rQBZCbFBQftf2vij2VYSXiZCQ9TALGrkAaNOHWSoYLUJMigBeXkkwZDZD' });

    expect(fbUser).toEqual({
      name: 'Artur Test',
      email: 'artur_kkcqexm_test@tfbnw.net',
      facebookId: '100653928990288',
    });
  });
});
