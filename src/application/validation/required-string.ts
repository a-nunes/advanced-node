import { RequiredFieldError } from '@/application/errors';
import { Validator } from '@/application/validation';

export class RequiredStringValidator implements Validator {
  constructor(
    private readonly fieldValue: string,
    private readonly fieldName: string,
  ) {}

  validate(): Error | undefined {
    if (this.fieldValue === '' || this.fieldValue === null || this.fieldValue === undefined) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
