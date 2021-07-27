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
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;
  let key: string;
  let expiration: number;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    secret = 'private_key';
    key = 'any_key';
    expiration = 1000;
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret);
  });

  it('should call sign with correct params', async () => {
    await sut.generateToken({ key, expiration });

    expect(fakeJwt.sign).toHaveBeenCalledWith(key, secret, { expiresIn: 1 });
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });
});
