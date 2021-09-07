import { badRequest, HttpResponse, serverError } from '@/application/helpers';
import { Validator, ValidatorComposite } from '@/application/validation';

export abstract class Controller {
  abstract execute(httpRequest: any): Promise<HttpResponse>;

  buildValidators(_httpRequest: any): Validator[] {
    return [];
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const validationError = this.validate(httpRequest);
    if (validationError) return badRequest(validationError);
    try {
      return await this.execute(httpRequest);
    } catch (error) {
      return serverError(error);
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    return new ValidatorComposite(validators).validate();
  }
}
