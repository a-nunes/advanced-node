import { LoadFacebookUserApi } from '@/data/contracts/apis';
import {
  LoadUserAccountRepository,
  CreateUserByFacebookAccountRepository,
  UpdateUserByFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<
    LoadUserAccountRepository &
      CreateUserByFacebookAccountRepository &
      UpdateUserByFacebookAccountRepository
  >;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    facebookApi = mock();
    userAccountRepository = mock();
    facebookApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository);
  });

  it('should call loadFacebookUserApi with correct params', async () => {
    await sut.execute({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.execute({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('should load user account when LoadFacebookUserApi returns data', async () => {
    await sut.execute({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should create account when userAccountRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined);
    await sut.execute({ token });

    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update user account when userAccountRepository returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.execute({ token });

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should update user account when userAccountRepository returns data without name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
    });

    await sut.execute({ token });

    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
