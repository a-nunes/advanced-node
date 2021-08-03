type HttpResponse = {
  statusCode: number,
  data: any,
};

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse | undefined> {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return {
        statusCode: 400,
        data: new Error('The field token is required.'),
      };
    }
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
});
