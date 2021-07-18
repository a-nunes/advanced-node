import { FacebookAuthentication } from '@/domain/features';

import { mock } from 'jest-mock-extended';

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async execute(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params);
  }
}

interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApi.Params): Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

describe('FacebookAuthenticationService', () => {
  it('should call loadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);
    await sut.execute({ token: 'any_token' });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token',
    });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });
});
