import { JwtTokenGenerator } from '@/infra/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;
  let key: string;
  let expirationInMs: number;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_generated_token');
    secret = 'private_key';
    key = 'any_key';
    expirationInMs = 1000;
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key, expirationInMs });

    expect(fakeJwt.sign).toHaveBeenCalledWith(key, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });

  it('should return token on success', async () => {
    const result = await sut.generateToken({ key, expirationInMs });

    expect(result).toBe('any_generated_token');
  });

  it('should rethrows if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error'); });

    const result = sut.generateToken({ key, expirationInMs });

    await expect(result).rejects.toThrow(new Error('token_error'));
  });
});
