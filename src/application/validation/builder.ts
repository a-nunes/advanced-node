import { RequiredStringValidator, Validator } from '@/application/validation';

export class ValidatorBuilder {
  private validators: Validator[] = [];

  private constructor(
    private readonly field: string,
    private readonly fieldName: string,
  ) {}

  static of(params: { field: string, fieldName: string }): ValidatorBuilder {
    return new ValidatorBuilder(params.field, params.fieldName);
  }

  required(): ValidatorBuilder {
    const validator = new RequiredStringValidator(this.field, this.fieldName);
    this.validators.push(validator);
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
