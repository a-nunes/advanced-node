import { PgUser } from '@/infra/postgres/entities';
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repositories';

import { getRepository } from 'typeorm';

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private pgUserRepository = getRepository(PgUser);

  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepository.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id,
        name: pgUser?.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(params: SaveFacebookAccountRepository.Params): Promise<void> {
    if (params.id) {
      await this.pgUserRepository.update(params.id, {
        name: params.name,
        facebookId: params.facebookId,
      });
    } else {
      await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
    }
  }
}
