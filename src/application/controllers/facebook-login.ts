import {
  badRequest, HttpResponse, ok, serverError, unauthorized,
} from '@/application/helpers';
import { RequiredStringValidator, ValidatorComposite } from '@/application/validation';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpRequest = {
  token: string;
};

type Model = Error | { accessToken: string };
export class FacebookLoginController {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}

  async handle({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate({ token });
      if (error) {
        return badRequest(error);
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

  private validate({ token }: HttpRequest): Error | undefined {
    const validators = [new RequiredStringValidator(token, 'token')];
    return new ValidatorComposite(validators).validate();
  }
}
