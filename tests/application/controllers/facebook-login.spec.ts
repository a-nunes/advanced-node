import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpResponse = {
  statusCode: number,
  data: any,
};

class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required.'),
        };
      }
      const result = await this.facebookAuth.execute(httpRequest);
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value },
        };
      }
      return {
        statusCode: 401,
        data: result,
      };
    } catch {
      return {
        statusCode: 500,
        data: new Error('Internal Server Error'),
      };
    }
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let httpRequest: object;

  beforeAll(() => {
    httpRequest = { token: 'valid_token' };
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
      data: new AuthenticationError(),
    });
  });

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle(httpRequest);

    expect(facebookAuth.execute).toHaveBeenCalledWith({ token: 'valid_token' });
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1);
  });

  it('should return 200 and accessToken if authentication succeeds', async () => {
    const res = await sut.handle(httpRequest);

    expect(res).toEqual({
      statusCode: 200,
      data: { accessToken: 'access_token' },
    });
  });
});
