import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { mock, MockProxy } from 'jest-mock-extended';

type HttpResponse = {
  statusCode: number,
  data: any,
};

class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required.'),
      };
    }
    await this.facebookAuth.execute(httpRequest);
    return {
      statusCode: 401,
      data: new AuthenticationError(),
    };
  }
}

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let httpRequest: object;

  beforeAll(() => {
    httpRequest = { token: 'valid_token' };
    facebookAuth = mock();
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

  it('should return 401 if token is invalid', async () => {
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
});
