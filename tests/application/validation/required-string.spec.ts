import { RequiredFieldError } from '@/application/errors';

class RequiredStringValidator {
  constructor(
    private readonly field: string,
    private readonly fieldName: string,
  ) {}

  validate(): Error {
    return new RequiredFieldError(this.fieldName);
  }
}

describe('RequiredStringValidator', () => {
  it('should return error if field is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field');

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError('any_field'));
  });

  it('should return error if field is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field');

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError('any_field'));
  });

  it('should return error if field is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field');

    const result = sut.validate();

    expect(result).toEqual(new RequiredFieldError('any_field'));
  });
});
