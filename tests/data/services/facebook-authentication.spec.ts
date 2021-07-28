import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories';
import { FacebookAuthenticationService } from '@/data/services';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken, FacebookAccount } from '@/domain/models';
import { TokenGenerator } from '@/data/contracts/crypto';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let crypto: MockProxy<TokenGenerator>;
  let sut: FacebookAuthenticationService;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      email: 'any_fb_email',
      name: 'any_fb_name',
      facebookId: 'any_fb_id',
    });
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' });
    crypto = mock();
    crypto.generateToken.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepository,
      crypto,
    );
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

  it('should call saveWithFacebook with FacebookAccount data', async () => {
    await sut.execute({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(
      expect.any(FacebookAccount),
    );
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.execute({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.execute({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('should rethrows if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_Error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('fb_Error'));
  });

  it('should rethrows if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_Error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('fb_Error'));
  });

  it('should rethrows if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_Error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('load_Error'));
  });

  it('should rethrows if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_Error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('save_Error'));
  });

  it('should rethrows if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
