import { Validator, ValidatorComposite } from '@/application/validation';

import { mock, MockProxy } from 'jest-mock-extended';

describe('ValidatorComposite', () => {
  let sut: ValidatorComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeAll(() => {
    validator1 = mock();
    validator2 = mock();
    validator1.validate.mockReturnValue(undefined);
    validator2.validate.mockReturnValue(undefined);
    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidatorComposite(validators);
  });

  it('should return undefined if all validators returns undefined', () => {
    const result = sut.validate();

    expect(result).toBeUndefined();
  });

  it('should return first error if more validators fails', () => {
    validator1.validate.mockReturnValueOnce(new Error('first_error'));
    validator2.validate.mockReturnValueOnce(new Error('second_error'));

    const result = sut.validate();

    expect(result).toEqual(new Error('first_error'));
  });

  it('should return error if one validator fails', () => {
    validator2.validate.mockReturnValueOnce(new Error('second_error'));

    const result = sut.validate();

    expect(result).toEqual(new Error('second_error'));
  });
});
