import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  CreateUserByFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let createUserByFacebookAccountRepository: MockProxy<CreateUserByFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadUserAccountRepository = mock();
    createUserByFacebookAccountRepository = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createUserByFacebookAccountRepository,
    );
  });

  it('should call loadFacebookUserApi with correct params', async () => {
    await sut.execute({ token });

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token });
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.execute({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token });

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call CreateUserByFacebookAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined);
    await sut.execute({ token });

    expect(
      createUserByFacebookAccountRepository.createFromFacebook,
    ).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    expect(
      createUserByFacebookAccountRepository.createFromFacebook,
    ).toHaveBeenCalledTimes(1);
  });
});
