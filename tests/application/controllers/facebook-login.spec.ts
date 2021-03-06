import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';
import { FacebookLoginController } from '@/application/controllers';
import { ServerError } from '@/application/errors';
import { UnauthorizedError } from '@/application/errors/http/unauthorized';
import { RequiredStringValidator, ValidatorComposite } from '@/application/validation';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

jest.mock('@/application/validation/composite');

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

  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_fails');
    const ValidatorCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    mocked(ValidatorComposite).mockImplementationOnce(ValidatorCompositeSpy);

    const res = await sut.handle({ token });

    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('valid_token', 'token'),
    ]);
    expect(res).toEqual({
      statusCode: 400,
      data: error,
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
