import { mock, MockProxy } from 'jest-mock-extended';

import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases';
import { AuthenticationError } from '@/domain/entities/errors';
import { AccessToken, FacebookAccount } from '@/domain/entities';

describe('FacebookAuthenticationService', () => {
  let facebook: MockProxy<LoadFacebookUser>;
  let userAccountRepository: MockProxy<LoadUserAccount & SaveFacebookAccount>;
  let crypto: MockProxy<TokenGenerator>;
  let sut: FacebookAuthentication;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebook = mock();
    facebook.loadUser.mockResolvedValue({
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
    sut = setupFacebookAuthentication(
      facebook,
      userAccountRepository,
      crypto,
    );
  });

  it('should call loadFacebookUserApi with correct params', async () => {
    await sut({ token });

    expect(facebook.loadUser).toHaveBeenCalledWith({ token });
    expect(facebook.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should throw AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    facebook.loadUser.mockResolvedValueOnce(undefined);

    const authResult = sut({ token });

    await expect(authResult).rejects.toThrow(new AuthenticationError());
  });

  it('should load user account when LoadFacebookUserApi returns data', async () => {
    await sut({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_fb_email',
    });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call saveWithFacebook with FacebookAccount data', async () => {
    await sut({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith(
      expect.any(FacebookAccount),
    );
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token });

    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });

  it('should rethrows if LoadFacebookUserApi throws', async () => {
    facebook.loadUser.mockRejectedValueOnce(new Error('fb_Error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('fb_Error'));
  });

  it('should rethrows if LoadFacebookUserApi throws', async () => {
    facebook.loadUser.mockRejectedValueOnce(new Error('fb_Error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('fb_Error'));
  });

  it('should rethrows if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_Error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('load_Error'));
  });

  it('should rethrows if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_Error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('save_Error'));
  });

  it('should rethrows if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
