import { AuthenticationError } from '@/domain/errors';

type HttpResponse = {
  statusCode: number,
  data: any,
};

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required.'),
      };
    }
    return {
      statusCode: 401,
      data: new AuthenticationError(),
    };
  }
}

describe('FacebookLoginController', () => {
  it('should return 400 if token is empty', async () => {
    const httpRequest = { token: '' };
    const sut = new FacebookLoginController();

    const res = await sut.handle(httpRequest);

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 400 if token is null', async () => {
    const httpRequest = { token: null };
    const sut = new FacebookLoginController();

    const res = await sut.handle(httpRequest);

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 400 if token is undefined', async () => {
    const httpRequest = { token: undefined };
    const sut = new FacebookLoginController();

    const res = await sut.handle(httpRequest);

    expect(res).toEqual({
      statusCode: 400,
      data: new Error('The field token is required.'),
    });
  });

  it('should return 401 if token is invalid', async () => {
    const httpRequest = { token: 'invalid_token' };
    const sut = new FacebookLoginController();

    const res = await sut.handle(httpRequest);

    expect(res).toEqual({
      statusCode: 401,
      data: new AuthenticationError(),
    });
  });
});
