import { TokenGenerator } from '@/data/contracts/crypto';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expiration / 1000;
    await jwt.sign(params.key, this.secret, { expiresIn: expirationInSeconds });
  }
}

describe('JwtTokenGenerator', () => {
  it('should call sign with correct params', async () => {
    const fakeJwt = jwt as jest.Mocked<typeof jwt>;

    const sut = new JwtTokenGenerator('private_key');

    await sut.generateToken({ key: 'any_key', expiration: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      'any_key',
      'private_key',
      { expiresIn: 1 },
    );
  });
});
