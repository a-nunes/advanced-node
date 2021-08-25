import { Controller } from '@/application/controllers';
import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { Validator, ValidatorBuilder } from '@/application/validation';
import { FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpRequest = { token: string; };
type Model = Error | { accessToken: string };
export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super();
  }

  async execute({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuth.execute({ token });
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return [
      ...ValidatorBuilder.of({ fieldValue: token, fieldName: 'token' }).required().build(),
    ];
  }
}
