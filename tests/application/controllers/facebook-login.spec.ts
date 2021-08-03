import { FacebookLoginController } from '@/application/controllers';
import { ServerError } from '@/application/errors';
import { UnauthorizedError } from '@/application/errors/http/unauthorized';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

import { mock, MockProxy } from 'jest-mock-extended';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    token = 'valid_token';
    facebookAuth = mock();
    facebookAuth.execute.mockResolvedValue(new AccessToken('access_token'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('should return 400 if token is empty', async () => {
    const res = await sut.handle({ token: '' });

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 400 if token is null', async () => {
    const res = await sut.handle({ token: null });

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const res = await sut.handle({ token: undefined });

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 401 if if authentication fails', async () => {
    facebookAuth.execute.mockResolvedValueOnce(new AuthenticationError());
    const res = await sut.handle({ token: 'invalid_token' });

    expect(res).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.execute).toHaveBeenCalledWith({ token: 'valid_token' });
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1);
  });

  it('should return 200 and accessToken if authentication succeeds', async () => {
    const res = await sut.handle({ token });

    expect(res).toEqual({
      statusCode: 200,
      data: { accessToken: 'access_token' },
    });
  });

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error');
    facebookAuth.execute.mockRejectedValueOnce(error);

    const res = await sut.handle({ token });

    expect(res).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
