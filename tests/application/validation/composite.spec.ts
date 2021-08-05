import { mock, MockProxy } from 'jest-mock-extended';

interface Validator {
  validate(): Error | undefined;
}

class ValidatorComposite {
  constructor(private readonly validators: Validator[]) {}

  validate(): undefined {
    return undefined;
  }
}

describe('ValidatorComposite', () => {
  let sut: ValidatorComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeAll(() => {
    validator1 = mock();
    validator1.validate.mockReturnValue(undefined);
    validator2 = mock();
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
});
