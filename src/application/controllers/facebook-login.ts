import { Controller } from '@/application/controllers';
import { HttpResponse, ok, unauthorized } from '@/application/helpers';
import { Validator, ValidatorBuilder } from '@/application/validation';
import { FacebookAuthentication } from '@/domain/use-cases';

type HttpRequest = { token: string; };
type Model = Error | { accessToken: string };
export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super();
  }

  async execute({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuth({ token });
      return ok(accessToken);
    } catch {
      return unauthorized();
    }
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return [
      ...ValidatorBuilder.of({ fieldValue: token, fieldName: 'token' }).required().build(),
    ];
  }
}
