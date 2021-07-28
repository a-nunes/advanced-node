import { PgUser } from '@/infra/postgres/entities';
import { LoadUserAccountRepository } from '@/data/contracts/repositories';

import { getRepository } from 'typeorm';

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepository = getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id,
        name: pgUser?.name ?? undefined,
      };
    }
  }
}
