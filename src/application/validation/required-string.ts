import { RequiredFieldError } from '@/application/errors';

export class RequiredStringValidator {
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
