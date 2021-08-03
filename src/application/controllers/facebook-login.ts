import { RequiredFieldError } from '@/application/errors';
import {
  badRequest, HttpResponse, ok, serverError, unauthorized,
} from '@/application/helpers';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpRequest = {
  token: string | null | undefined
};

type Model = Error | { accessToken: string };
export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (token === '' || token === null || token === undefined) {
        return badRequest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuth.execute({ token });
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      }
      return unauthorized();
    } catch (error) {
      return serverError(error);
    }
  }
}
