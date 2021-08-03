import { RequiredFieldError, ServerError } from '@/application/errors';
import { badRequest, HttpResponse, unauthorized } from '@/application/helpers';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return badRequest(new RequiredFieldError('token'));
      }
      const result = await this.facebookAuth.execute(httpRequest);
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value },
        };
      }
      return unauthorized();
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error),
      };
    }
  }
}
