import { RequiredStringValidator, Validator } from '@/application/validation';

type Input = { fieldValue: string, fieldName: string };
export class ValidatorBuilder {
  private validators: Validator[] = [];

  private constructor(
    private readonly fieldValue: string,
    private readonly fieldName: string,
  ) {}

  static of({ fieldName, fieldValue }: Input): ValidatorBuilder {
    return new ValidatorBuilder(fieldValue, fieldName);
  }

  required(): ValidatorBuilder {
    const validator = new RequiredStringValidator(this.fieldValue, this.fieldName);
    this.validators.push(validator);
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
