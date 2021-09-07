import { mocked } from 'ts-jest/utils';
import { FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator, ValidatorComposite } from '@/application/validation';
import { AuthenticationError } from '@/domain/entities/errors';

jest.mock('@/application/validation/composite');

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: jest.Mock;
  let token: string;

  beforeAll(() => {
    token = 'valid_token';
    facebookAuth = jest.fn();
    facebookAuth.mockResolvedValue({ accessToken: 'access_token' });
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

  it('should return 401 if authentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError());

    const res = await sut.handle({ token: 'invalid_token' });

    expect(res).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth).toHaveBeenCalledWith({ token: 'valid_token' });
    expect(facebookAuth).toHaveBeenCalledTimes(1);
  });

  it('should return 200 and accessToken if authentication succeeds', async () => {
    const res = await sut.handle({ token });

    expect(res).toEqual({
      statusCode: 200,
      data: { accessToken: 'access_token' },
    });
  });
});
