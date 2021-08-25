import { AccessToken } from '@/domain/models';

describe('AccessToken', () => {
  let sut: AccessToken;
  beforeEach(() => {
    sut = new AccessToken('any_value');
  });
  it('should call AccessToken with correct value', () => {
    expect(sut).toEqual({ value: 'any_value' });
  });

  it('should return expirationInMs with 1800000ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000);
  });
});
