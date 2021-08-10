import { RequiredStringValidator } from '@/application/validation';

interface Validator {
  validate(): Error | undefined;
}

class ValidatorBuilder {
  private validators: Validator[] = [];

  private constructor(
    private readonly field: string,
    private readonly fieldName: string,
  ) {}

  static of(field: string, fieldName: string): ValidatorBuilder {
    return new ValidatorBuilder(field, fieldName);
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

describe('ValidatorBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const sut = ValidatorBuilder.of('any_token', 'token').required().build();

    expect(sut).toEqual([new RequiredStringValidator('any_token', 'token')]);
  });
});
