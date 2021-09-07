import { AccessToken } from '@/domain/entities';

describe('AccessToken', () => {
  it('should return expirationInMs with 1800000ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000);
  });
});
