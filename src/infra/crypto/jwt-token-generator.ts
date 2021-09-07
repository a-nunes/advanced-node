import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/domain/contracts/gateways';

type Input = TokenGenerator.Input;
type Output = TokenGenerator.Output;
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken({ expirationInMs, key }: Input): Promise<Output> {
    const expirationInSeconds = expirationInMs / 1000;
    return jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds });
  }
}
