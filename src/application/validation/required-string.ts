import { RequiredFieldError } from '@/application/errors';
import { Validator } from '@/application/validation';

export class RequiredStringValidator implements Validator {
  constructor(
    private readonly field: string,
    private readonly fieldName: string,
  ) {}

  validate(): Error | undefined {
    if (this.field === '' || this.field === null || this.field === undefined) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
