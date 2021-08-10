import { RequiredStringValidator, ValidatorBuilder } from '@/application/validation';

describe('ValidatorBuilder', () => {
  it('should return a RequiredStringValidator', () => {
    const sut = ValidatorBuilder.of('any_token', 'token').required().build();

    expect(sut).toEqual([new RequiredStringValidator('any_token', 'token')]);
  });
});
