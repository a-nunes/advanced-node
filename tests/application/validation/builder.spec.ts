import { RequiredStringValidator, ValidatorBuilder } from '@/application/validation';

describe('ValidatorBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const sut = ValidatorBuilder.of({ field: 'any_token', fieldName: 'token' }).required().build();

    expect(sut).toEqual([new RequiredStringValidator('any_token', 'token')]);
  });
});
